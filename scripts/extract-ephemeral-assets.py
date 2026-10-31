"""Extracts the Ephemeral Ground page's images. Dev-only. Run: python scripts/extract-ephemeral-assets.py

Sources (in assets-src, not deployed): portfolio.pdf, whose pages are flattened 1753x1240 JPEGs, and
ug thesis.psd, which holds real layers for pp.05-06, 23 and 24 only. See docs/ephemeral-ground-plan.md.

Never upscales. Rebuilds public/images/ephemeral-ground and src/content/ephemeral-ground.images.ts.
Needs pymupdf, psd-tools and Pillow.

Deliberately not extracted: photos showing people who may be Jarawa or Shompen (p.07 Nicobarese collage,
p.08 "Lessons" collage and BBC clipping, p.22 clipping), and the PSD's hidden layers, which include
another person's CV and portfolio page.
"""
import io
import shutil
from pathlib import Path

import numpy
import pymupdf
from PIL import Image, ImageDraw, ImageFilter
from psd_tools import PSDImage

Image.MAX_IMAGE_PIXELS = None

OUT = Path("public/images/ephemeral-ground")
# Swapped in only once every image has saved, so a failed run leaves the site's images alone.
BUILD = Path("assets-src/extracted/ephemeral-ground-build")
MANIFEST = Path("src/content/ephemeral-ground.images.ts")
QUALITY = 82

# Printed page -> (PDF page, side). PDF pages 10 and 11 are in the wrong order.
PAGES = {
    7: (5, 0), 8: (5, 1), 9: (6, 0), 10: (6, 1), 11: (7, 0), 12: (7, 1), 13: (8, 0), 14: (8, 1),
    15: (9, 0), 16: (9, 1), 17: (11, 0), 18: (11, 1), 19: (10, 0), 20: (10, 1), 21: (12, 0), 22: (12, 1),
}

# name: (printed page, (left, top, right, bottom)) in the page's own 1753x1240 pixels.
CROPS = {
    "island/malacca-map": (7, (1260, 130, 1725, 500)),
    "island/dwelling-hut-a": (7, (512, 582, 883, 786)),
    "island/dwelling-hut-b": (7, (1527, 582, 1698, 786)),
    "island/proposal-map": (7, (505, 858, 745, 1215)),
    "island/icon-airport": (7, (1052, 915, 1172, 1032)),
    "island/icon-township": (7, (1238, 915, 1370, 1032)),
    "island/icon-terminal": (7, (1418, 912, 1542, 1032)),
    "island/icon-power": (7, (1600, 915, 1672, 1030)),
    "island/island-maps": (8, (1395, 85, 1730, 485)),
    "island/trees-graphic": (8, (30, 845, 265, 1140)),
    "island/heat-map": (8, (268, 845, 498, 1140)),
    "island/port-map": (8, (545, 845, 915, 1140)),
    "island/section-sketch": (8, (975, 845, 1368, 1160)),
    "ground/tribal-map": (9, (85, 40, 565, 700)),
    "ground/project-land-map": (9, (680, 40, 1140, 705)),
    "ground/land-use-map": (9, (1260, 40, 1735, 700)),
    "ground/settlements-strip": (9, (0, 735, 1753, 1215)),
    "ground/infrastructure-strip": (10, (28, 40, 1445, 235)),
    "ground/contour-plan": (10, (65, 290, 1222, 835)),
    "ground/site-section": (10, (80, 825, 1245, 990)),
    "ground/site-context": (10, (1243, 765, 1712, 1024)),
    "ground/site-photos": (10, (30, 1036, 1660, 1210)),
    "idea/arch-collage": (11, (90, 90, 695, 990)),
    "idea/terrain": (11, (845, 112, 1622, 390)),
    "idea/slope-ratio": (11, (845, 436, 1622, 802)),
    "idea/accessibility": (11, (845, 804, 1622, 1190)),
    "idea/strategy-canopy": (12, (525, 95, 838, 195)),
    "idea/strategy-tower": (12, (70, 220, 510, 430)),
    "idea/strategy-steps": (12, (860, 210, 1200, 460)),
    "idea/strategy-locator": (12, (1530, 55, 1635, 255)),
    "idea/strategy-buffer": (12, (535, 455, 780, 590)),
    "idea/strategy-exchange": (12, (1330, 405, 1670, 605)),
    "idea/strategy-terrain": (12, (535, 680, 760, 845)),
    "idea/strategy-market": (12, (858, 728, 1118, 968)),
    "idea/strategy-wetland": (12, (100, 855, 495, 1010)),
    "idea/strategy-water": (12, (1470, 750, 1708, 1020)),
    "idea/strategy-climate": (12, (575, 1005, 780, 1205)),
    "idea/strategy-boat": (12, (900, 980, 1065, 1205)),
    "settlement/opening-collage": (13, (100, 55, 402, 392)),
    "settlement/forest-aerial": (13, (0, 527, 540, 705)),
    "settlement/cluster-diagram": (13, (530, 405, 788, 690)),
    "settlement/isometric-model": (13, (1005, 305, 1710, 735)),
    "settlement/tsunami-render": (14, (52, 90, 1090, 465)),
    "settlement/tsunami-zoning": (14, (44, 505, 1375, 1212)),
    "settlement/masterplan": (15, (35, 320, 1700, 1066)),
    "settlement/strategy-water": (16, (70, 105, 400, 305)),
    "settlement/strategy-gradient": (16, (570, 25, 735, 325)),
    "settlement/strategy-ecology": (16, (910, 110, 1295, 275)),
    "settlement/strategy-layout": (16, (1395, 65, 1660, 320)),
    "settlement/strategy-walkability": (16, (65, 515, 395, 695)),
    "settlement/strategy-resilience": (16, (485, 550, 885, 662)),
    "settlement/strategy-contour": (16, (930, 515, 1265, 675)),
    "settlement/strategy-roads": (16, (1420, 515, 1635, 705)),
    "settlement/site-section": (16, (0, 945, 1753, 1185)),
    "settlement/hall-models": (17, (75, 770, 635, 1172)),
    "settlement/hall-plans": (17, (520, 55, 1700, 1178)),
    "settlement/kitchen-plans": (18, (110, 95, 1090, 905)),
    "settlement/kitchen-key": (18, (1215, 85, 1710, 320)),
    "settlement/kitchen-elevation": (18, (45, 980, 1660, 1235)),
    "settlement/residential-plan": (19, (45, 85, 865, 1195)),
    "settlement/hut-photos": (19, (925, 60, 1108, 185)),
    "settlement/commons-plan": (19, (1075, 272, 1217, 445)),
    "settlement/family-ground": (19, (1065, 520, 1392, 672)),
    "settlement/family-first": (19, (1390, 520, 1715, 672)),
    "settlement/small-unit": (19, (1020, 768, 1180, 892)),
    "settlement/apartment-plan": (19, (1285, 815, 1680, 952)),
    "settlement/apartment-section": (19, (1220, 1018, 1730, 1158)),
    "settlement/cluster-residential": (20, (258, 120, 900, 812)),
    "settlement/cluster-tourist": (20, (1060, 85, 1445, 812)),
    "settlement/walkway-sketch": (20, (45, 680, 245, 790)),
    "settlement/street-elevation": (20, (235, 875, 1695, 1160)),
    "settlement/visitors-plan": (21, (135, 55, 1550, 845)),
    "settlement/visitors-section": (21, (200, 875, 1430, 1240)),
    "settlement/materials": (21, (1437, 815, 1682, 890)),
    "settlement/cultural-plan": (22, (80, 90, 1400, 1005)),
    "settlement/cultural-key": (22, (1222, 85, 1710, 385)),
    "settlement/cultural-section": (22, (0, 1025, 940, 1235)),
}

# Her text and legends sit on white here, so they're painted out: they become real HTML.
# In page coordinates. Rectangles are (l, t, r, b); longer tuples are polygon points.
PAINT_WHITE = {
    "ground/tribal-map": [(85, 40, 310, 54)],
    "ground/infrastructure-strip": [(28, 40, 215, 75)],
    "ground/contour-plan": [(640, 737, 1222, 835), (420, 835, 505, 742, 640, 728, 640, 835)],
    "ground/site-section": [(700, 825, 1245, 905), (85, 825, 215, 885), (370, 825, 530, 825, 490, 868, 370, 868)],
    "ground/site-context": [(1615, 770, 1712, 842)],
    "settlement/isometric-model": [(1005, 405, 1040, 575)],
    "settlement/masterplan": [(1360, 985, 1700, 1066)],
    "settlement/site-section": [
        (160, 1030, 370, 1060), (425, 1015, 550, 1070), (525, 975, 640, 1025), (935, 955, 1065, 982),
        (980, 1033, 1075, 1085), (1215, 945, 1335, 995), (1305, 1037, 1395, 1088), (1460, 1065, 1610, 1095),
    ],
    "settlement/hall-plans": [(520, 55, 650, 520), (530, 720, 672, 738), (520, 765, 640, 1178), (1660, 1170, 1700, 1178)],
    "settlement/kitchen-plans": [(285, 450, 665, 475), (905, 340, 1090, 485)],
    "settlement/residential-plan": [
        (150, 85, 470, 283, 750, 408, 870, 408, 870, 85), (815, 500, 865, 680), (815, 1015, 865, 1195),
    ],
    "settlement/visitors-plan": [(135, 55, 380, 108)],
    "settlement/visitors-section": [(200, 875, 830, 1055)],
    "settlement/cultural-plan": [(700, 90, 1400, 400), (90, 90, 400, 108)],
    "idea/slope-ratio": [(1100, 438, 1392, 519), (852, 683, 1010, 802)],
}

# Her text sits on watercolour here, so white paint would show: only the ink is lifted (see lift_text).
LIFT_TEXT = {
    "ground/settlements-strip": [
        (5, 752, 216, 800), (290, 800, 500, 848), (432, 735, 668, 782), (936, 936, 1134, 980), (1276, 862, 1492, 908),
        (1522, 852, 1734, 896), (688, 790, 1154, 936), (1252, 700, 1722, 844), (1660, 1172, 1704, 1198),
    ],
}

# name: (PSD layer id, widest px to keep, crop or None)
LAYERS = {
    "idea/photo-strip": (1681, 2112, None),
    "idea/neuro-stress": (1689, 461, None),
    "idea/neuro-sensory": (1694, 449, None),
    "idea/neuro-nature": (1703, 689, (230, 0, 689, 528)),
    "idea/neuro-architecture": (1709, 462, None),
    "idea/neuro-legibility": (1714, 432, None),
    "idea/neuro-environment": (1719, 468, None),
    "idea/lone-tree": (1743, 1320, (820, 195, 1090, 556)),
    "idea/walker": (1746, 1075, (495, 570, 1075, 715)),
    "idea/case-brion": (1757, 2152, None),
    "idea/case-brick": (1761, 1549, (340, 0, 1549, 530)),
    "idea/render-housing": (1788, 1340, None),
}

# The four arches are one layer. name: (crop, areas to clear, as polygons in the layer's pixels).
# Her leaf overlaps arches 3 and 4: Tanizaki stops above it, and Zumthor loses Tanizaki's piece beside it.
ARCHES_LAYER = 1629
ARCHES = {
    "idea/arch-rosa": ((0, 0, 520, 1190), []),
    "idea/arch-pallasmaa": ((530, 0, 1000, 1190), []),
    "idea/arch-tanizaki": ((1002, 0, 1478, 1000), []),
    "idea/arch-zumthor": ((1430, 0, 1957, 1265), [[(1430, 0), (1479, 0), (1479, 1030), (1437, 1172), (1430, 1172)]]),
}

# Smart objects hold their own originals, larger than the placed size.
SMART_OBJECTS = {
    "idea/render-hall": 1783,
    "idea/render-residential": 1787,
}
# Her Library panel is two renders, one above the other. (name, top layer, bottom layer)
STACKED_RENDERS = ("idea/render-library", 1784, 1785)

# Cut from her white page, and shown on paper: white becomes transparent, as if printed on it.
ON_PAPER = {
    "idea/arch-collage", "idea/terrain", "idea/slope-ratio", "idea/accessibility", "ground/settlements-strip",
    "ground/infrastructure-strip", "ground/contour-plan", "ground/site-section", "ground/site-context",
}

# Her sketches sit on the teal page with hard crop edges, so those edges fade out.
SOFT_EDGE = 12


# Phones show the residential half of the isometric plan. (name, source, crop as fractions, widest px)
PLAN_MOBILE = ("opening/plan-mobile", "assets-src/extracted/ug-thesis-ab20/site-plan-fullres.png", (0.52, 0.19, 0.79, 0.78), 1400)


def save(image, name, manifest):
    path = BUILD / f"{name}.webp"
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "WEBP", quality=QUALITY, method=6)
    manifest[name] = (f"/images/ephemeral-ground/{name}.webp", image.width, image.height, path.stat().st_size)


def smart_object(layer):
    return Image.open(io.BytesIO(layer.smart_object.data)).convert("RGB")


def white_to_alpha(image):
    rgb = numpy.asarray(image, dtype=float)
    alpha = 1 - rgb.min(axis=2) / 255
    alpha[alpha < 0.03] = 0
    safe = numpy.maximum(alpha, 1 / 255)[..., None]
    colour = numpy.clip((rgb - (1 - alpha[..., None]) * 255) / safe, 0, 255)
    return Image.fromarray(numpy.dstack((colour, alpha * 255)).astype("uint8"), "RGBA")


def soften(image):
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).rectangle((SOFT_EDGE, SOFT_EDGE, image.width - SOFT_EDGE, image.height - SOFT_EDGE), fill=255)
    soft = image.convert("RGBA")
    soft.putalpha(mask.filter(ImageFilter.GaussianBlur(SOFT_EDGE / 2)))
    return soft


def lift_text(page, boxes):
    """Finds the dark strokes in each box and rebuilds only those pixels from the wash around them."""
    out = page.copy()
    for box in boxes:
        reach = 24
        left, top = max(box[0] - reach, 0), max(box[1] - reach, 0)
        area = (left, top, min(box[2] + reach, page.width), min(box[3] + reach, page.height))
        patch = out.crop(area)
        grey = patch.convert("L")
        darker = numpy.asarray(grey.filter(ImageFilter.GaussianBlur(12)), dtype=float) - numpy.asarray(grey, dtype=float)
        ink = numpy.zeros(darker.shape, dtype=bool)
        inside = (slice(box[1] - top, box[3] - top), slice(box[0] - left, box[2] - left))
        ink[inside] = darker[inside] > 10
        hole = numpy.asarray(Image.fromarray((ink * 255).astype("uint8")).filter(ImageFilter.MaxFilter(7)), dtype=float) / 255
        keep = 1 - hole
        pixels = numpy.asarray(patch, dtype=float)
        rebuilt = numpy.empty_like(pixels)
        # Close, then wider where a line of text leaves nothing nearby to copy.
        for radius in (24, 6):
            weight = numpy.asarray(Image.fromarray((keep * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(radius)), dtype=float)
            for channel in range(3):
                kept = Image.fromarray((pixels[..., channel] * keep).astype("uint8")).filter(ImageFilter.GaussianBlur(radius))
                value = numpy.asarray(kept, dtype=float) / numpy.maximum(weight, 1) * 255
                rebuilt[..., channel] = value if radius == 24 else numpy.where(weight > 40, value, rebuilt[..., channel])
        merged = pixels * keep[..., None] + rebuilt * hole[..., None]
        out.paste(Image.fromarray(numpy.clip(merged, 0, 255).astype("uint8")), (left, top))
    return out


def crop_page(page, name, box):
    image = lift_text(page, LIFT_TEXT[name]) if name in LIFT_TEXT else page.copy()
    draw = ImageDraw.Draw(image)
    for shape in PAINT_WHITE.get(name, []):
        if len(shape) == 4:
            draw.rectangle(shape, fill="white")
        else:
            draw.polygon(shape, fill="white")
    return image.crop(box)


def main():
    if BUILD.exists():
        shutil.rmtree(BUILD)
    manifest = {}
    pdf = pymupdf.open("assets-src/portfolio.pdf")
    pages = {}
    for printed, (number, side) in PAGES.items():
        xref = pdf[number - 1].get_images()[side][0]
        pages[printed] = Image.open(io.BytesIO(pdf.extract_image(xref)["image"])).convert("RGB")

    for name, (printed, box) in CROPS.items():
        image = crop_page(pages[printed], name, box)
        if name in ON_PAPER:
            image = white_to_alpha(image)
        elif name.startswith("idea/strategy-"):
            image = soften(image)
        save(image, name, manifest)

    name, source, (left, top, right, bottom), widest = PLAN_MOBILE
    plan = Image.open(source).convert("RGBA")
    plan = plan.crop((int(left * plan.width), int(top * plan.height), int(right * plan.width), int(bottom * plan.height)))
    flat = Image.new("RGB", plan.size, "white")
    flat.paste(plan, (0, 0), plan)
    if flat.width > widest:
        flat = flat.resize((widest, round(flat.height * widest / flat.width)), Image.LANCZOS)
    save(flat, name, manifest)

    psd = PSDImage.open("assets-src/ug thesis.psd")
    layers = {layer.layer_id: layer for layer in psd.descendants()}
    for name, (layer_id, widest, box) in LAYERS.items():
        image = layers[layer_id].topil()
        if box:
            image = image.crop(box)
        if image.width > widest:
            image = image.resize((widest, round(image.height * widest / image.width)), Image.LANCZOS)
        save(image, name, manifest)
    for name, (box, clear) in ARCHES.items():
        image = layers[ARCHES_LAYER].topil().convert("RGBA")
        draw = ImageDraw.Draw(image)
        for polygon in clear:
            draw.polygon(polygon, fill=(0, 0, 0, 0))
        save(image.crop(box), name, manifest)
    for name, layer_id in SMART_OBJECTS.items():
        save(smart_object(layers[layer_id]), name, manifest)
    name, top, bottom = STACKED_RENDERS
    top, bottom = smart_object(layers[top]), smart_object(layers[bottom])
    stacked = Image.new("RGB", (top.width, top.height + bottom.height))
    stacked.paste(top, (0, 0))
    stacked.paste(bottom, (0, top.height))
    save(stacked, name, manifest)

    if OUT.exists():
        shutil.rmtree(OUT)
    BUILD.replace(OUT)

    lines = [
        "// Generated by scripts/extract-ephemeral-assets.py. Do not edit by hand.",
        "export const images = {",
    ]
    for name, (src, width, height, _) in manifest.items():
        lines.append(f'  "{name}": {{ src: "{src}", width: {width}, height: {height} }},')
    lines += ["} as const;", "", "export type ImageName = keyof typeof images;", ""]
    MANIFEST.write_text("\n".join(lines), encoding="utf-8")

    total = sum(entry[3] for entry in manifest.values())
    print(f"{len(manifest)} images, {total // 1024} KB total")


if __name__ == "__main__":
    main()
