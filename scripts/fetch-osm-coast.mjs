// Fetches the Nicobar coastline from OpenStreetMap for scripts/generate-map.mjs --osm. Dev-only.
// Writes assets-src/osm/nicobar-coast.json (not deployed). Data © OpenStreetMap contributors, ODbL.
// Run with `node scripts/fetch-osm-coast.mjs`.
import { mkdirSync, writeFileSync } from "node:fs";

const ENDPOINT = "https://overpass-api.de/api/interpreter";
const OUT = "assets-src/osm/nicobar-coast.json";

// South, west, north, east: Great Nicobar, Little Nicobar and the islets around them.
const BBOX = "6.5,93.5,7.6,94.2";
const QUERY = `[out:json][timeout:90];way["natural"="coastline"](${BBOX});out geom;`;

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "subhana-khan-portfolio/dev" },
  body: `data=${encodeURIComponent(QUERY)}`,
});
if (!response.ok) throw new Error(`Overpass ${response.status}: ${(await response.text()).slice(0, 200)}`);
const { elements } = await response.json();

// Coastlines come as many ways: join them end to end into closed rings.
const pieces = elements.map((way) => ({ nodes: [...way.nodes], points: way.geometry.map((p) => [p.lon, p.lat]) }));
const rings = [];
let open = 0;
while (pieces.length) {
  const ring = pieces.pop();
  for (let joined = true; joined && ring.nodes[0] !== ring.nodes.at(-1); ) {
    joined = false;
    for (let i = 0; i < pieces.length; i++) {
      const next = pieces[i];
      if (next.nodes[0] === ring.nodes.at(-1)) {
        ring.nodes.push(...next.nodes.slice(1));
        ring.points.push(...next.points.slice(1));
      } else if (next.nodes.at(-1) === ring.nodes[0]) {
        ring.nodes.unshift(...next.nodes.slice(0, -1));
        ring.points.unshift(...next.points.slice(0, -1));
      } else if (next.nodes.at(-1) === ring.nodes.at(-1)) {
        ring.nodes.push(...next.nodes.slice(0, -1).reverse());
        ring.points.push(...next.points.slice(0, -1).reverse());
      } else if (next.nodes[0] === ring.nodes[0]) {
        ring.nodes.unshift(...next.nodes.slice(1).reverse());
        ring.points.unshift(...next.points.slice(1).reverse());
      } else continue;
      pieces.splice(i, 1);
      joined = true;
      break;
    }
  }
  if (ring.nodes[0] === ring.nodes.at(-1)) rings.push(ring.points);
  else open++;
}

mkdirSync("assets-src/osm", { recursive: true });
writeFileSync(OUT, JSON.stringify({ attribution: "© OpenStreetMap contributors", license: "ODbL-1.0", rings }));
const sizes = rings.map((r) => r.length).sort((a, b) => b - a);
console.log(`${elements.length} ways -> ${rings.length} closed rings, ${open} left open, largest ${sizes.slice(0, 5).join(", ")} points`);
