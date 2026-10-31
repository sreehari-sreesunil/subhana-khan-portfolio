"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import Drawing, { type DrawingProps } from "./Drawing";

export type CalloutSpot = {
  /** Centre of the spot, as fractions of the image. */
  x: number;
  y: number;
  /** Width of the spot, as a fraction of the image's width. */
  size: number;
};

type CalloutProps = Omit<DrawingProps, "children"> & {
  spot: CalloutSpot;
  /** A different, more detailed drawing of hers. Never a magnified crop of the same one. */
  detail: Omit<DrawingProps, "children" | "group">;
};

function centre(rect: DOMRect, box: DOMRect) {
  return { x: rect.left - box.left + rect.width / 2, y: rect.top - box.top + rect.height / 2, r: Math.min(rect.width, rect.height) / 2 };
}

/** Runs from circle to detail, measured so it stays right at any window size. */
function Leader({ id, group }: { id: string; group: number }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const cells = svg?.parentElement;
    const line = svg?.querySelector("path");
    const ring = cells?.querySelector(`[data-callout-ring="${id}"]`);
    const detail = cells?.querySelector(`[data-callout-detail="${id}"]`);
    if (!cells || !line || !ring || !detail) return;

    const place = () => {
      const box = cells.getBoundingClientRect();
      const from = centre(ring.getBoundingClientRect(), box);
      const to = centre(detail.getBoundingClientRect(), box);
      const length = Math.hypot(to.x - from.x, to.y - from.y) || 1;
      const [ux, uy] = [(to.x - from.x) / length, (to.y - from.y) / length];
      line.setAttribute("d", `M${from.x + ux * from.r} ${from.y + uy * from.r}L${to.x - ux * to.r} ${to.y - uy * to.r}`);
    };
    const observer = new ResizeObserver(place);
    observer.observe(cells);
    return () => observer.disconnect();
  }, [id]);

  return (
    <svg ref={svgRef} aria-hidden="true" data-sheet-step="callout" data-sheet-group={group} className="sheet-leader">
      <path fill="none" stroke="currentColor" strokeWidth="1" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
    </svg>
  );
}

/** A circle on a drawing and a leader line to a more detailed drawing of that spot, such as masterplan → cluster → unit. */
export default function Callout({ spot, detail, ...drawing }: CalloutProps) {
  const id = useId();
  const { group = 0 } = drawing;
  const ring: CSSProperties = { left: `${spot.x * 100}%`, top: `${spot.y * 100}%`, width: `${spot.size * 100}%` };

  return (
    <>
      <Drawing {...drawing}>
        <span data-callout-ring={id} data-sheet-step="callout" data-sheet-group={group} className="sheet-ring" style={ring} />
      </Drawing>
      <Leader id={id} group={group} />
      <Drawing {...detail} group={group}>
        <span data-callout-detail={id} className="pointer-events-none absolute inset-0" />
      </Drawing>
    </>
  );
}
