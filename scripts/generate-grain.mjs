// Generates public/textures/grain.png: a seamless 256×256 warm-grey noise tile.
// Run once with `node scripts/generate-grain.mjs`. Deterministic (fixed seed).
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const SIZE = 256;
const SEED = 20260529;

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const random = mulberry32(SEED);
const rowBytes = SIZE * 3 + 1;
const raw = Buffer.alloc(rowBytes * SIZE);

for (let y = 0; y < SIZE; y++) {
  raw[y * rowBytes] = 0;
  for (let x = 0; x < SIZE; x++) {
    // Average of two samples softens the noise; values stay light so multiply only darkens a little.
    const v = 150 + ((random() + random()) / 2) * 105;
    const i = y * rowBytes + 1 + x * 3;
    raw[i] = Math.min(255, Math.round(v));
    raw[i + 1] = Math.round(v * 0.97);
    raw[i + 2] = Math.round(v * 0.91);
  }
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // colour type: RGB
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

mkdirSync("public/textures", { recursive: true });
writeFileSync("public/textures/grain.png", png);
console.log(`Wrote public/textures/grain.png (${png.length} bytes)`);
