// Generates public/images/home/ephemeral-ground/map.svg: the Indian Ocean from Sri Lanka to the
// Malacca Strait, styled like her p.07 map. The islands the Ephemeral Ground camera dives past keep
// every Natural Earth point and are drawn as smooth curves, so they hold up at 20×.
// Source: Natural Earth 10m land (public domain). Download it first (not committed):
//   curl -L -o assets-src/natural-earth/ne_10m_land.geojson \
//     https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_land.geojson
// Then run `node scripts/generate-map.mjs`. Prints `mapDot`, `mapRing` and `site.target` for home.ts.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const SRC = "assets-src/natural-earth/ne_10m_land.geojson";
const OUT = "public/images/home/ephemeral-ground/map.svg";

// Region (degrees) and output width (SVG units).
const LON_MIN = 78;
const LON_MAX = 105;
const LAT_MIN = -3;
const LAT_MAX = 14.5;
const WIDTH = 1000;
// Douglas–Peucker tolerance in SVG units (≈1 km, ≈1 px on screen at 4× zoom).
const TOLERANCE = 0.3;

// Colours sampled from her page 07 map; land is the --sand token.
const SEA = "#70BBB7";
const LAND = "#E9D6B6";

const GREAT_NICOBAR = { lon: 93.85, lat: 7.0 };
// Her site, near Campbell Bay on the east coast.
const SITE = [93.93, 7.0];
const CLOSE_UP = { lonMin: 93.5, lonMax: 94.2, latMin: 6.5, latMax: 7.6 };

const inCloseUp = (ring) =>
  ring.every(([lon, lat]) => lon >= CLOSE_UP.lonMin && lon <= CLOSE_UP.lonMax && lat >= CLOSE_UP.latMin && lat <= CLOSE_UP.latMax);

const toRad = (d) => (d * Math.PI) / 180;
const mercY = (lat) => (Math.log(Math.tan(Math.PI / 4 + toRad(lat) / 2)) * 180) / Math.PI;
const SCALE = WIDTH / (LON_MAX - LON_MIN);
const HEIGHT = (mercY(LAT_MAX) - mercY(LAT_MIN)) * SCALE;
const project = ([lon, lat]) => [(lon - LON_MIN) * SCALE, (mercY(LAT_MAX) - mercY(lat)) * SCALE];

/** Sutherland–Hodgman clip of one ring against the region rectangle (in lon/lat). */
function clipRing(ring) {
  const edges = [
    (p) => p[0] >= LON_MIN,
    (p) => p[0] <= LON_MAX,
    (p) => p[1] >= LAT_MIN,
    (p) => p[1] <= LAT_MAX,
  ];
  const cut = [
    (a, b) => [LON_MIN, a[1] + ((b[1] - a[1]) * (LON_MIN - a[0])) / (b[0] - a[0])],
    (a, b) => [LON_MAX, a[1] + ((b[1] - a[1]) * (LON_MAX - a[0])) / (b[0] - a[0])],
    (a, b) => [a[0] + ((b[0] - a[0]) * (LAT_MIN - a[1])) / (b[1] - a[1]), LAT_MIN],
    (a, b) => [a[0] + ((b[0] - a[0]) * (LAT_MAX - a[1])) / (b[1] - a[1]), LAT_MAX],
  ];
  let pts = ring;
  for (let e = 0; e < 4 && pts.length; e++) {
    const inside = edges[e];
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const cur = pts[i];
      const prev = pts[(i + pts.length - 1) % pts.length];
      if (inside(cur)) {
        if (!inside(prev)) out.push(cut[e](prev, cur));
        out.push(cur);
      } else if (inside(prev)) {
        out.push(cut[e](prev, cur));
      }
    }
    pts = out;
  }
  return pts;
}

/** Iterative Douglas–Peucker on an open polyline. */
function simplify(pts, tol) {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const len = Math.hypot(bx - ax, by - ay);
    let max = 0;
    let idx = -1;
    for (let i = a + 1; i < b; i++) {
      // A closed ring starts and ends on the same point: measure plain distance from it.
      const d =
        len < 1e-9
          ? Math.hypot(pts[i][0] - ax, pts[i][1] - ay)
          : Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / len;
      if (d > max) {
        max = d;
        idx = i;
      }
    }
    if (idx >= 0 && max > tol) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

const area = (pts) =>
  pts.reduce((s, p, i) => {
    const q = pts[(i + 1) % pts.length];
    return s + p[0] * q[1] - q[0] * p[1];
  }, 0) / 2;

function centroid(pts) {
  const a = area(pts);
  let cx = 0;
  let cy = 0;
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % pts.length];
    const f = p[0] * q[1] - q[0] * p[1];
    cx += (p[0] + q[0]) * f;
    cy += (p[1] + q[1]) * f;
  });
  return [cx / (6 * a), cy / (6 * a)];
}

const intersectsRegion = (ring) => {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const [x, y] of ring) {
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  return x1 >= LON_MIN && x0 <= LON_MAX && y1 >= LAT_MIN && y0 <= LAT_MAX;
};

const geo = JSON.parse(readFileSync(SRC, "utf8"));
const rings = [];
const smoothRings = [];
for (const feature of geo.features) {
  const g = feature.geometry;
  const polygons = g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
  for (const polygon of polygons) {
    if (!intersectsRegion(polygon[0])) continue;
    for (const ring of polygon) {
      const clipped = clipRing(ring.slice(0, -1));
      if (clipped.length < 3) continue;
      const projected = clipped.map(project);
      if (inCloseUp(clipped)) {
        smoothRings.push(projected);
        continue;
      }
      const simple = simplify([...projected, projected[0]], TOLERANCE).slice(0, -1);
      if (simple.length >= 3 && Math.abs(area(simple)) > 0.02) rings.push(simple);
    }
  }
}

// Great Nicobar: the ring containing the island's approximate centre (bounding-box test).
const [gx, gy] = project([GREAT_NICOBAR.lon, GREAT_NICOBAR.lat]);
const island = smoothRings
  .filter((r) => {
    const xs = r.map((p) => p[0]);
    const ys = r.map((p) => p[1]);
    return gx >= Math.min(...xs) && gx <= Math.max(...xs) && gy >= Math.min(...ys) && gy <= Math.max(...ys);
  })
  .sort((a, b) => Math.abs(area(a)) - Math.abs(area(b)))[0];
if (!island) throw new Error("Great Nicobar not found in the clipped data");
const [cx, cy] = centroid(island);
const ixs = island.map((p) => p[0]);
const iys = island.map((p) => p[1]);
const islandW = Math.max(...ixs) - Math.min(...ixs);
const islandH = Math.max(...iys) - Math.min(...iys);
const radius = islandH * 1.5;
const [siteX, siteY] = project(SITE);

const f = (n) => n.toFixed(1);
const f2 = (n) => n.toFixed(2);

/** Closed Catmull–Rom spline through every point, as cubic Béziers. */
function smoothPath(r) {
  const at = (i) => r[(i + r.length) % r.length];
  let path = `M${f2(r[0][0])} ${f2(r[0][1])}`;
  for (let i = 0; i < r.length; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    path += `C${f2(c1[0])} ${f2(c1[1])} ${f2(c2[0])} ${f2(c2[1])} ${f2(p2[0])} ${f2(p2[1])}`;
  }
  return `${path}Z`;
}

const d =
  rings.map((r) => `M${r.map((p) => `${f(p[0])} ${f(p[1])}`).join("L")}Z`).join("") +
  smoothRings.map(smoothPath).join("");
const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${f(HEIGHT)}" width="${WIDTH}" height="${Math.round(HEIGHT)}">` +
  `<rect width="${WIDTH}" height="${f(HEIGHT)}" fill="${SEA}"/>` +
  `<path fill="${LAND}" fill-rule="evenodd" d="${d}"/>` +
  `</svg>\n`;

mkdirSync("public/images/home/ephemeral-ground", { recursive: true });
writeFileSync(OUT, svg);
console.log(
  JSON.stringify(
    {
      out: OUT,
      bytes: svg.length,
      rings: rings.length,
      size: [WIDTH, Math.round(HEIGHT)],
      greatNicobar: {
        points: island.length,
        widthUnits: +islandW.toFixed(1),
        heightUnits: +islandH.toFixed(1),
        mapDot: { x: +((cx / WIDTH) * 100).toFixed(2), y: +((cy / HEIGHT) * 100).toFixed(2) },
        mapRing: { cx: +cx.toFixed(1), cy: +cy.toFixed(1), r: +radius.toFixed(1) },
      },
      closeUpRings: smoothRings.length,
      siteTarget: { x: +siteX.toFixed(2), y: +siteY.toFixed(2) },
    },
    null,
    2,
  ),
);
