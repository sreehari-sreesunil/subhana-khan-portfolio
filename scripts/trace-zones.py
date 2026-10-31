"""Traces the proposed development zones for sheet 1.4 from her maps, onto our island.

Parks and township come from the colours of her p.07 map. Port and airport are only numbered markers
there, so their outlines come from her p.09 land-use map, which also shows the land to be reclaimed.

Each map is fitted to our coastline with one affine transform (a single stretch, rotate and shift),
found by maximising the overlap of the two island shapes. Her maps are stylised, so the result is
approximate and says so in its caption.

Run `python scripts/trace-zones.py [check.png]`, which writes src/content/ephemeral-zones.ts and, given a
path, an overlay of the traced shapes on her map. Needs pymupdf, numpy and Pillow.
"""

import io
import json
import re
import sys
from pathlib import Path

import numpy
import pymupdf
from PIL import Image, ImageDraw, ImageFilter

MAP = Path("public/images/home/ephemeral-ground/map-osm.svg")
OUT = Path("src/content/ephemeral-zones.ts")
# Printed page -> (PDF page, side), as in extract-ephemeral-assets.py.
PAGES = {7: (5, 0), 9: (6, 0)}

# Great Nicobar in map units, for finding its ring in the map.
ISLAND_AT = (587.1, 284.0)
# Grid pixels per map unit, and the land kept around the island so zones run past the coast.
GRID = 24
MARGIN = 5
# Zones run this far under each other (grid pixels of blur), so no sand shows along a shared edge.
BLUR = 5
OVERLAP = 0.42
# Drops specks, in grid pixels.
MIN_LOOP = 90
TOLERANCE = 0.035

# p.07: the island without its caption and locator inset, in the page's own pixels.
P7_BOX = (505, 858, 745, 1215)
P7_INSET = (23, 195, 72, 350)
P7_COLOURS = {
    "campbell": (150, 225, 0),
    "galathea": (2, 185, 118),
    # Unnamed on her map, inside Galathea: taken as part of it.
    "galathea-inner": (1, 222, 3),
    "township": (3, 134, 58),
    "sea": (232, 236, 238),
}
# Her numbered markers, as (x, y) inside P7_BOX.
P7_MARKERS = {"port": (169, 318), "airport": (193, 294), "township": (195, 196), "power": (157, 282)}

# p.09: the land-use map, without its legend, and the part of it that holds port and airport.
P9_BOX = (1260, 40, 1735, 700)
P9_LEGEND = (0, 355, 180, 660)
P9_SOUTH = (195, 470, 370, 600)


def page(printed):
    number, side = PAGES[printed]
    pdf = pymupdf.open("assets-src/portfolio.pdf")
    xref = pdf[number - 1].get_images()[side][0]
    return Image.open(io.BytesIO(pdf.extract_image(xref)["image"])).convert("RGB")


def island_ring():
    """The map's own Great Nicobar path, and its points."""
    svg = MAP.read_text(encoding="utf-8")
    best = None
    for sub in re.findall(r"M[^MZ]*C[^MZ]*Z", svg):
        numbers = [float(n) for n in re.findall(r"-?\d+\.?\d*", sub)]
        xs, ys = numbers[0::2], numbers[1::2]
        inside = min(xs) < ISLAND_AT[0] < max(xs) and min(ys) < ISLAND_AT[1] < max(ys)
        if inside and (best is None or len(numbers) > len(best[1])):
            best = sub, numbers
    d, numbers = best
    # A cubic gives three points per segment; the third is on the curve.
    points = [(numbers[0], numbers[1])] + [(numbers[i], numbers[i + 1]) for i in range(6, len(numbers), 6)]
    return d, points


def box_blur(mask, radius):
    """A soft version of a mask: three box blurs, close to a gaussian."""
    out = mask.astype(float)
    size = 2 * radius + 1
    for _ in range(3):
        for axis in (0, 1):
            total = numpy.cumsum(numpy.pad(out, [(radius + 1, radius) if a == axis else (0, 0) for a in (0, 1)], mode="edge"), axis=axis)
            high = numpy.take(total, range(size, total.shape[axis]), axis=axis)
            low = numpy.take(total, range(0, total.shape[axis] - size), axis=axis)
            out = (high - low) / size
    return out


def warp(affine, shape, origin):
    """Where each grid pixel falls in her image."""
    ys, xs = numpy.mgrid[0 : shape[0], 0 : shape[1]]
    x = origin[0] + (xs + 0.5) / GRID
    y = origin[1] + (ys + 0.5) / GRID
    return affine[0] * x + affine[1] * y + affine[2], affine[3] * x + affine[4] * y + affine[5]


def sample(image, u, v, outside=0):
    iu, iv = numpy.floor(u).astype(int), numpy.floor(v).astype(int)
    inside = (iu >= 0) & (iv >= 0) & (iu < image.shape[1]) & (iv < image.shape[0])
    out = numpy.full(u.shape, outside, dtype=image.dtype)
    out[inside] = image[iv[inside], iu[inside]]
    return out


def fit(theirs, ours, origin):
    """The affine (from map units to her pixels) with the best overlap of the two island shapes."""
    step = 4
    small = ours[::step, ::step]

    def score(a):
        ys, xs = numpy.mgrid[0 : ours.shape[0] : step, 0 : ours.shape[1] : step]
        x, y = origin[0] + (xs + 0.5) / GRID, origin[1] + (ys + 0.5) / GRID
        hit = sample(theirs, a[0] * x + a[1] * y + a[2], a[3] * x + a[4] * y + a[5]).astype(bool)
        return (hit & small).sum() / (hit | small).sum()

    rows, cols = numpy.nonzero(theirs)
    my, mx = numpy.nonzero(ours)
    mx0, mx1 = origin[0] + mx.min() / GRID, origin[0] + mx.max() / GRID
    my0, my1 = origin[1] + my.min() / GRID, origin[1] + my.max() / GRID
    sx, sy = (cols.max() - cols.min()) / (mx1 - mx0), (rows.max() - rows.min()) / (my1 - my0)
    a = numpy.array([sx, 0, cols.min() - sx * mx0, 0, sy, rows.min() - sy * my0], dtype=float)
    best = score(a)
    # Scale terms move in small steps, shifts in pixels; each round halves them.
    steps = numpy.array([sx * 0.04, sx * 0.04, 4, sy * 0.04, sy * 0.04, 4])
    for _ in range(9):
        moved = True
        while moved:
            moved = False
            for i in range(6):
                for sign in (1, -1):
                    trial = a.copy()
                    trial[i] += sign * steps[i]
                    # Stretching around the island's middle, so a scale step doesn't throw it away.
                    if i in (0, 1, 3, 4):
                        centre = ((mx0 + mx1) / 2, (my0 + my1) / 2)[i % 3]
                        trial[2 if i < 3 else 5] -= sign * steps[i] * centre
                    s = score(trial)
                    if s > best:
                        a, best, moved = trial, s, True
        steps /= 2
    return a, best


def classify_p7(image):
    pixels = numpy.asarray(image, dtype=float)
    names = list(P7_COLOURS)
    palette = numpy.array([P7_COLOURS[n] for n in names], dtype=float)
    distance = ((pixels[:, :, None, :] - palette) ** 2).sum(-1) ** 0.5
    nearest = distance.argmin(-1)
    labels = numpy.zeros(nearest.shape, dtype=numpy.uint8)
    # 0 unknown (type, markers), 1 campbell, 2 galathea, 3 township, 4 sea.
    codes = {"campbell": 1, "galathea": 2, "galathea-inner": 2, "township": 3, "sea": 4}
    for i, name in enumerate(names):
        labels[(nearest == i) & (distance.min(-1) < 70)] = codes[name]
    x0, y0, x1, y1 = P7_INSET
    labels[y0:y1, x0:x1] = 4
    labels[:40, :110] = 4
    return labels


def spread(labels, keep):
    """Fills unknown grid pixels with the most common label beside them, working inwards."""
    out = labels.copy()
    for _ in range(400):
        empty = (out == 0) & keep
        if not empty.any():
            break
        votes = numpy.stack([
            sum(numpy.roll(out == code, shift, axis) for axis in (0, 1) for shift in (1, -1))
            for code in range(1, out.max() + 1)
        ])
        best = votes.argmax(0) + 1
        fill = empty & (votes.max(0) > 0)
        out[fill] = best[fill]
    return out


def p9_island(image):
    """Her coast is a thin line: everything the sea can't reach is the island."""
    grey = numpy.asarray(image.convert("L")).copy()
    x0, y0, x1, y1 = P9_LEGEND
    grey[y0:y1, x0:x1] = 255
    # One pixel thicker, as the line has gaps once it is thresholded.
    walls = Image.fromarray(((grey < 238) * 255).astype(numpy.uint8)).filter(ImageFilter.MaxFilter(3))
    framed = Image.new("L", (walls.width + 2, walls.height + 2), 0)
    framed.paste(walls, (1, 1))
    ImageDraw.floodfill(framed, (0, 0), 128)
    land = numpy.asarray(framed)[1:-1, 1:-1] != 128
    # Keeps the island itself, not place names in the sea.
    marked = Image.fromarray((land * 255).astype(numpy.uint8)).copy()
    ImageDraw.floodfill(marked, (250, 200), 128)
    return numpy.asarray(marked) == 128


def classify_p9(image):
    """1 port, 2 airport: her two greys, inside the south end of the map."""
    pixels = numpy.asarray(image, dtype=float)
    light = pixels.mean(-1)
    tint = pixels.max(-1) - pixels.min(-1)
    labels = numpy.zeros(light.shape, dtype=numpy.uint8)
    labels[(light > 112) & (light < 185) & (tint < 34)] = 1
    labels[(light > 72) & (light <= 112) & (tint < 45)] = 2
    x0, y0, x1, y1 = P9_SOUTH
    mask = numpy.zeros(light.shape, dtype=bool)
    mask[y0:y1, x0:x1] = True
    labels[~mask] = 0
    return labels


def loops(mask):
    """Closed outlines of a mask, along pixel edges."""
    grown = numpy.pad(mask, 1)
    edges = {}
    h, w = grown.shape
    rows, cols = numpy.nonzero(grown[1:-1, 1:-1])
    for r, c in zip(rows + 1, cols + 1):
        if not grown[r - 1, c]:
            edges.setdefault((c, r), []).append((c + 1, r))
        if not grown[r, c + 1]:
            edges.setdefault((c + 1, r), []).append((c + 1, r + 1))
        if not grown[r + 1, c]:
            edges.setdefault((c + 1, r + 1), []).append((c, r + 1))
        if not grown[r, c - 1]:
            edges.setdefault((c, r + 1), []).append((c, r))
    out = []
    while edges:
        start = next(iter(edges))
        point, ring = start, []
        while True:
            ring.append(point)
            nexts = edges[point]
            step = nexts.pop()
            if not nexts:
                del edges[point]
            point = step
            if point == start:
                break
        if len(ring) >= MIN_LOOP:
            out.append([(x - 1, y - 1) for x, y in ring])
    return out


def simplify(points, tolerance):
    """Douglas–Peucker on an open polyline."""
    keep = {0, len(points) - 1}
    stack = [(0, len(points) - 1)]
    p = numpy.array(points)
    while stack:
        a, b = stack.pop()
        if b <= a + 1:
            continue
        d = p[b] - p[a]
        length = numpy.hypot(*d)
        rel = p[a + 1 : b] - p[a]
        dist = numpy.abs(d[0] * rel[:, 1] - d[1] * rel[:, 0]) / length if length else numpy.hypot(rel[:, 0], rel[:, 1])
        i = int(dist.argmax())
        if dist[i] > tolerance:
            keep.add(a + 1 + i)
            stack += [(a, a + 1 + i), (a + 1 + i, b)]
    return [points[i] for i in sorted(keep)]


def smooth_ring(ring):
    """Takes out the pixel stairs: each point moves to the average of its neighbours."""
    p = numpy.array(ring, dtype=float)
    for _ in range(6):
        p = (numpy.roll(p, 1, 0) + 2 * p + numpy.roll(p, -1, 0)) / 4
    return p


def to_path(mask, origin):
    d = ""
    for ring in loops(mask):
        p = smooth_ring(ring)
        points = [(origin[0] + x / GRID, origin[1] + y / GRID) for x, y in p]
        points = simplify(points + points[:1], TOLERANCE)[:-1]
        if len(points) >= 3:
            d += "M" + "L".join(f"{x:.2f} {y:.2f}" for x, y in points) + "Z"
    return d


def main():
    island_d, ring = island_ring()
    xs, ys = [p[0] for p in ring], [p[1] for p in ring]
    origin = (min(xs) - MARGIN, min(ys) - MARGIN)
    shape = (round((max(ys) - min(ys) + 2 * MARGIN) * GRID), round((max(xs) - min(xs) + 2 * MARGIN) * GRID))
    canvas = Image.new("1", (shape[1], shape[0]))
    ImageDraw.Draw(canvas).polygon([((x - origin[0]) * GRID, (y - origin[1]) * GRID) for x, y in ring], fill=1)
    ours = numpy.asarray(canvas).copy()

    p7 = page(7).crop(P7_BOX)
    labels7 = classify_p7(p7)
    land7 = numpy.isin(labels7, (1, 2, 3))
    land7 = box_blur(land7, 2) > 0.5
    a7, score7 = fit(land7, ours, origin)
    print(f"p.07 fit: overlap {score7:.3f}")

    p9 = page(9).crop(P9_BOX)
    land9 = p9_island(p9)
    a9, score9 = fit(land9, ours, origin)
    print(f"p.09 fit: overlap {score9:.3f}")

    # The whole island, plus a margin under the clip, gets a label; bits her map leaves out take their neighbour's.
    u, v = warp(a7, shape, origin)
    grid7 = sample(labels7, u, v, outside=0)
    grid7[grid7 == 4] = 0
    reach = box_blur(ours, 14) > 0.01
    grid7[~reach] = 0
    filled = spread(grid7, reach)

    paths = {}
    for name, code in (("campbell", 1), ("galathea", 2), ("township", 3)):
        paths[name] = to_path(box_blur(filled == code, BLUR) > OVERLAP, origin)

    u, v = warp(a9, shape, origin)
    grid9 = sample(classify_p9(p9), u, v)
    for name, code in (("port", 1), ("airport", 2)):
        paths[name] = to_path(box_blur(grid9 == code, 1) > 0.45, origin)

    # Inverse of her p.07 fit, for the markers.
    matrix = numpy.array([[a7[0], a7[1]], [a7[3], a7[4]]])
    inverse = numpy.linalg.inv(matrix)
    markers = {}
    for name, (x, y) in P7_MARKERS.items():
        mx, my = inverse @ numpy.array([x - a7[2], y - a7[5]])
        markers[name] = {"x": round(float(mx), 2), "y": round(float(my), 2)}

    body = (
        "// Generated by scripts/trace-zones.py from her p.07 and p.09 maps. Do not edit by hand.\n"
        f"export const zoneIsland = {json.dumps(island_d)};\n\n"
        f"export const zonePaths = {json.dumps(paths, indent=2)};\n\n"
        f"export const zoneMarkers = {json.dumps(markers, indent=2)};\n"
    )
    OUT.write_text(body, encoding="utf-8", newline="\n")
    print(f"{OUT}: {len(body) // 1024}KB")

    if len(sys.argv) > 1:
        check(sys.argv[1], p7, p9, a7, a9, ring, filled, ours, paths, markers, origin)


def check(path, p7, p9, a7, a9, ring, filled, ours, paths, markers, origin):
    """Three panels at 6×: her p.07 map, her p.09 map, and the shapes on our island."""
    scale = 6
    top, left = 0, 0
    box = (origin[0], origin[1], origin[0] + ours.shape[1] / GRID, origin[1] + ours.shape[0] / GRID)
    size = (round((box[2] - box[0]) * GRID), round((box[3] - box[1]) * GRID))

    def her(image, a):
        coeffs = (
            a[0] / GRID, a[1] / GRID, a[0] * box[0] + a[1] * box[1] + a[2],
            a[3] / GRID, a[4] / GRID, a[3] * box[0] + a[4] * box[1] + a[5],
        )
        return image.transform(size, Image.AFFINE, coeffs, Image.BILINEAR, fillcolor=(255, 255, 255))

    def coast(image):
        draw = ImageDraw.Draw(image)
        points = [((x - box[0]) * GRID, (y - box[1]) * GRID) for x, y in ring]
        draw.line(points + points[:1], fill=(255, 0, 80), width=2)
        return image

    fill = {"campbell": (157, 181, 138), "galathea": (182, 200, 160), "township": (156, 107, 74), "port": (90, 60, 40), "airport": (59, 42, 28)}
    drawn = Image.new("RGB", size, (112, 187, 183))
    mask = Image.fromarray((ours * 255).astype(numpy.uint8))
    drawn.paste((233, 214, 182), (0, 0), mask)
    draw = ImageDraw.Draw(drawn)
    for name in fill:
        for sub in re.findall(r"M([^Z]*)Z", paths[name]):
            points = [tuple(float(n) for n in pair.split()) for pair in sub.split("L")]
            draw.polygon([((x - box[0]) * GRID, (y - box[1]) * GRID) for x, y in points], fill=fill[name])
    coast(drawn)
    for point in markers.values():
        x, y = (point["x"] - box[0]) * GRID, (point["y"] - box[1]) * GRID
        draw.ellipse((x - 7, y - 7, x + 7, y + 7), fill=(200, 30, 30))
    panels = [coast(her(p7, a7)), coast(her(p9, a9)), drawn]
    sheet = Image.new("RGB", (size[0] * 3 + 40, size[1]), (255, 255, 255))
    for i, panel in enumerate(panels):
        sheet.paste(panel, (i * (size[0] + 20), 0))
    sheet.save(path)


main()
