import type { ReactNode } from "react";

type Pt = [number, number];

// Body drawn in a 1000×600 box and stretched to fit the text (preserveAspectRatio="none").
const W = 1000;
export const TORN_WIDTH = W;
const H = 600;
const MARGIN = 14;
const RADIUS = 46;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Points around a rounded rectangle, each with its outward normal. */
function roundedRect(x: number, y: number, w: number, h: number, r: number, step: number) {
  const out: { p: Pt; n: Pt }[] = [];
  const line = (x0: number, y0: number, x1: number, y1: number, n: Pt) => {
    const k = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let i = 0; i < k; i++) out.push({ p: [x0 + ((x1 - x0) * i) / k, y0 + ((y1 - y0) * i) / k], n });
  };
  const arc = (cx: number, cy: number, a0: number, a1: number) => {
    const k = Math.max(1, Math.round((r * Math.abs(a1 - a0)) / step));
    for (let i = 0; i < k; i++) {
      const a = a0 + ((a1 - a0) * i) / k;
      const n: Pt = [Math.cos(a), Math.sin(a)];
      out.push({ p: [cx + r * n[0], cy + r * n[1]], n });
    }
  };
  line(x + r, y, x + w - r, y, [0, -1]);
  arc(x + w - r, y + r, -Math.PI / 2, 0);
  line(x + w, y + r, x + w, y + h - r, [1, 0]);
  arc(x + w - r, y + h - r, 0, Math.PI / 2);
  line(x + w - r, y + h, x + r, y + h, [0, 1]);
  arc(x + r, y + h - r, Math.PI / 2, Math.PI);
  line(x, y + h - r, x, y + r, [-1, 0]);
  arc(x + r, y + r, Math.PI, 1.5 * Math.PI);
  return out;
}

/**
 * Torn-paper outline: a fine ragged edge plus occasional bites (and a few small tabs).
 * Seeded, so the shape is identical on every render.
 */
export function tornBodyPath(seed: number, height: number, radius = RADIUS, width = W) {
  const rand = mulberry32(seed);
  const pts = roundedRect(MARGIN, MARGIN, width - 2 * MARGIN, height - 2 * MARGIN, radius, 5);
  let bite = 0;
  let biteLeft = 0;
  let biteLen = 0;
  const d = pts.map(({ p, n }) => {
    if (biteLeft === 0 && rand() < 0.07) {
      biteLen = biteLeft = 2 + Math.floor(rand() * 5);
      bite = rand() < 0.75 ? 4 + rand() * 9 : -(2 + rand() * 4);
    }
    let depth = rand() * 2.2;
    if (biteLeft > 0) {
      depth += bite * Math.sin((Math.PI * (biteLen - biteLeft + 0.5)) / biteLen);
      biteLeft--;
    }
    return `${(p[0] - n[0] * depth).toFixed(1)} ${(p[1] - n[1] * depth).toFixed(1)}`;
  });
  return `M${d.join("L")}Z`;
}

const BODY_PATH = tornBodyPath(20260101, H);
// Long text: drawn nearer its final proportions, so stretching doesn't turn the bites into spikes.
const TALL_H = 1000;
const TALLER_H = 3400;
const TALL_PATH = tornBodyPath(20260101, TALL_H);
const TALLER_PATH = tornBodyPath(20260101, TALLER_H);
// Tail traced from her page 01, in a 240×140 box (10 units per 1% of bubble width; the body's
// bottom edge sits at y≈23). It joins the body from 32% to 50% of its width; tip at 26.5%.
const TAIL_PATH = "M59 0 L57 39 C52 70 30 110 0 138 C60 128 200 80 238 23 L240 0 Z";

/**
 * Her cream speech bubble from page 01: torn edges, soft grey shadow, tail at the bottom-left.
 * Children are real HTML laid over the shape.
 */
export default function SpeechBubble({ children, tall = false }: { children: ReactNode; tall?: boolean }) {
  const bodyClass = "absolute inset-0 h-full w-full fill-bubble-cream";
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-0 drop-shadow-[-14px_14px_6px_var(--bubble-shadow)]"
      >
        {tall ? (
          <>
            <svg
              viewBox={`0 0 ${W} ${TALLER_H}`}
              preserveAspectRatio="none"
              className={`${bodyClass} md:hidden`}
            >
              <path d={TALLER_PATH} />
            </svg>
            <svg
              viewBox={`0 0 ${W} ${TALL_H}`}
              preserveAspectRatio="none"
              className={`${bodyClass} hidden md:block`}
            >
              <path d={TALL_PATH} />
            </svg>
          </>
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={bodyClass}>
            <path d={BODY_PATH} />
          </svg>
        )}
        <svg
          data-bubble-tail
          viewBox="0 0 240 140"
          className="absolute top-[calc(100%-1.25rem)] left-[26.5%] w-[24%] fill-bubble-cream"
        >
          <path d={TAIL_PATH} />
        </svg>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
