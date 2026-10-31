"use client";

import Image from "next/image";
import { useEffect, useId, useRef, type CSSProperties } from "react";
import Drawing, { type DrawingProps } from "./Drawing";
import SheetBlock from "./SheetBlock";

export type CalloutSpot = {
  /** Centre of the spot, as fractions of the image. */
  x: number;
  y: number;
  /** Width of the spot, as a fraction of the image's width. */
  size: number;
};

type CalloutProps = Omit<DrawingProps, "children"> & {
  spot: CalloutSpot;
  /** Cells for the enlarged crop. */
  cropAt: string;
  /** Column placement of the crop on phones, where it sits right under its drawing. */
  cropPhone?: string;
};

function centre(rect: DOMRect, box: DOMRect) {
  return { x: rect.left - box.left + rect.width / 2, y: rect.top - box.top + rect.height / 2, r: rect.width / 2 };
}

/** Runs from circle to crop, measured so it stays right at any window size. */
function Leader({ id, group }: { id: string; group: number }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const cells = svg?.parentElement;
    const line = svg?.querySelector("path");
    const ring = cells?.querySelector(`[data-callout-ring="${id}"]`);
    const crop = cells?.querySelector(`[data-callout-crop="${id}"]`);
    if (!cells || !line || !ring || !crop) return;

    const place = () => {
      const box = cells.getBoundingClientRect();
      const from = centre(ring.getBoundingClientRect(), box);
      const to = centre(crop.getBoundingClientRect(), box);
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

/** A circle on a drawing, a leader line and an enlarged crop of that spot from the same source image. */
export default function Callout({ spot, cropAt, cropPhone = "2 / span 2", ...drawing }: CalloutProps) {
  const id = useId();
  const { image, group = 0 } = drawing;
  const ratio = image.width / image.height;

  const ring: CSSProperties = { left: `${spot.x * 100}%`, top: `${spot.y * 100}%`, width: `${spot.size * 100}%` };
  const crop: CSSProperties = {
    width: `${100 / spot.size}%`,
    left: `${50 - (spot.x * 100) / spot.size}%`,
    top: `${50 - (spot.y * 100) / (spot.size * ratio)}%`,
  };

  return (
    <>
      <Drawing {...drawing}>
        <span data-callout-ring={id} data-sheet-step="callout" data-sheet-group={group} className="sheet-ring" style={ring} />
      </Drawing>
      <Leader id={id} group={group} />
      <SheetBlock at={cropAt} phone={cropPhone} className="sheet-drawing">
        <div
          data-callout-crop={id}
          data-sheet-step="callout"
          data-sheet-group={group}
          className="sheet-fit sheet-crop"
          style={{ "--sheet-ratio": 1 } as CSSProperties}
        >
          <Image src={image.src} alt="" width={image.width} height={image.height} sizes="60vw" className="absolute h-auto max-w-none" style={crop} />
        </div>
      </SheetBlock>
    </>
  );
}
