// Generates the seamless tiles in public/textures. Run with `node scripts/generate-grain.mjs`.
// Deterministic (fixed seeds).
//   grain.png        256×256 neutral noise around mid-grey, for soft-light on coloured sections
//   grain-white.png  the same noise kept light and warm, so multiply doesn't grey pure white
//   paper.png        512×512 fibres over a soft mottle around mid-grey, modelled on her page 01 paper
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const GRAIN_SIZE = 256;
const PAPER_SIZE = 512;

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

/** `pixel(x, y)` returns one value for grey or three for RGB. */
function writePng(path, size, channels, pixel) {
  const rowBytes = size * channels + 1;
  const raw = Buffer.alloc(rowBytes * size);
  for (let y = 0; y < size; y++) {
    raw[y * rowBytes] = 0;
    for (let x = 0; x < size; x++) {
      const values = pixel(x, y);
      for (let c = 0; c < channels; c++) {
        raw[y * rowBytes + 1 + x * channels + c] = Math.max(0, Math.min(255, Math.round(values[c])));
      }
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = channels === 1 ? 0 : 2; // colour type: grey or RGB
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  writeFileSync(path, png);
  console.log(`Wrote ${path} (${png.length} bytes)`);
}

mkdirSync("public/textures", { recursive: true });

// Grain: one noise field, -1 to 1, shared by both tiles.
const random = mulberry32(20260529);
const noise = Float32Array.from({ length: GRAIN_SIZE * GRAIN_SIZE }, () => random() + random() - 1);
const at = (x, y) => noise[y * GRAIN_SIZE + x];

writePng("public/textures/grain.png", GRAIN_SIZE, 1, (x, y) => [128 + at(x, y) * 127]);
writePng("public/textures/grain-white.png", GRAIN_SIZE, 3, (x, y) => {
  const v = 198 + at(x, y) * 57;
  return [v, v * 0.97, v * 0.91];
});

// Paper: periodic value noise for the mottle, then short curved fibres that wrap around the edges.
const paperRandom = mulberry32(20261030);
const field = new Float32Array(PAPER_SIZE * PAPER_SIZE);

function addMottle(cells, amplitude) {
  const lattice = Float32Array.from({ length: cells * cells }, () => paperRandom() * 2 - 1);
  const smooth = (t) => t * t * (3 - 2 * t);
  for (let y = 0; y < PAPER_SIZE; y++) {
    for (let x = 0; x < PAPER_SIZE; x++) {
      const gx = (x / PAPER_SIZE) * cells;
      const gy = (y / PAPER_SIZE) * cells;
      const x0 = Math.floor(gx);
      const y0 = Math.floor(gy);
      const fx = smooth(gx - x0);
      const fy = smooth(gy - y0);
      const cell = (i, j) => lattice[((j + cells) % cells) * cells + ((i + cells) % cells)];
      const top = cell(x0, y0) * (1 - fx) + cell(x0 + 1, y0) * fx;
      const bottom = cell(x0, y0 + 1) * (1 - fx) + cell(x0 + 1, y0 + 1) * fx;
      field[y * PAPER_SIZE + x] += (top * (1 - fy) + bottom * fy) * amplitude;
    }
  }
}

function stamp(x, y, strength) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  for (let j = 0; j <= 1; j++) {
    for (let i = 0; i <= 1; i++) {
      const weight = (i ? x - x0 : 1 - (x - x0)) * (j ? y - y0 : 1 - (y - y0));
      const px = (x0 + i + PAPER_SIZE) % PAPER_SIZE;
      const py = (y0 + j + PAPER_SIZE) % PAPER_SIZE;
      field[py * PAPER_SIZE + px] += strength * weight;
    }
  }
}

addMottle(6, 5);
addMottle(24, 4);
addMottle(96, 4);
for (let n = 0; n < 900; n++) {
  let x = paperRandom() * PAPER_SIZE;
  let y = paperRandom() * PAPER_SIZE;
  let angle = paperRandom() * Math.PI * 2;
  const bend = (paperRandom() - 0.5) * 0.08;
  const length = 5 + paperRandom() ** 3 * 24;
  // Mostly dark strands, as on her page, with a few pale ones.
  const strength = (paperRandom() < 0.78 ? -1 : 0.7) * (8 + paperRandom() * 16);
  for (let s = 0; s < length; s += 0.5) {
    const fade = Math.sin((Math.PI * s) / length);
    stamp(x, y, strength * fade * 0.5);
    x += Math.cos(angle) * 0.5;
    y += Math.sin(angle) * 0.5;
    angle += bend * 0.5;
  }
}

const mean = field.reduce((sum, v) => sum + v, 0) / field.length;
writePng("public/textures/paper.png", PAPER_SIZE, 1, (x, y) => [128 + field[y * PAPER_SIZE + x] - mean]);
