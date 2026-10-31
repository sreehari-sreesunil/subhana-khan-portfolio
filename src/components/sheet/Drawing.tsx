import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import SheetBlock from "./SheetBlock";

export type SheetImage = { src: string; width: number; height: number };

// Room kept under a drawing for its caption, so the two together fit the cells.
const CAPTION_ONE_LINE = "1.25rem";
const CAPTION_TWO_LINES = "2.25rem";
const HEADING = "1.25rem";

export type DrawingProps = {
  image: SheetImage;
  alt: string;
  at: string;
  phone?: string;
  sizes: string;
  /** "Fig. 2.6.3 — Slope Ratio", from the content file. */
  figure: string;
  credit?: string;
  /** A small heading above the drawing, part of the same block so its top lines up with its neighbours. */
  heading?: string;
  /** Reveal group: each drawing, its callout and its text play together, in group order. */
  group?: number;
  /** Size against the cell's height, so drawings on one sheet can keep their relative scale. */
  scale?: number;
  /** Sits above the drawing, unclipped by its wipe: a callout's circle, a key plan's box. */
  children?: ReactNode;
};

/** The figure number, with the credit beneath. As wide as the drawing it sits under. */
export function FigureCaption({ figure, credit, group = 0 }: { figure: string; credit?: string; group?: number }) {
  return (
    <figcaption data-sheet-step="text" data-sheet-group={group} className="sheet-caption font-ui">
      <span className="sheet-caption-title">{figure}</span>
      {credit}
    </figcaption>
  );
}

/** A drawing filling its cells, keeping its proportions. Its box is exactly the image, so overlays can use percentages. */
export default function Drawing({ image, alt, at, phone, sizes, figure, credit, heading, group = 0, scale, children }: DrawingProps) {
  const captionRoom = credit ? CAPTION_TWO_LINES : CAPTION_ONE_LINE;
  const style = {
    "--sheet-ratio": image.width / image.height,
    "--sheet-scale": scale,
    "--sheet-caption": heading ? `calc(${captionRoom} + ${HEADING})` : captionRoom,
  } as CSSProperties;
  return (
    <SheetBlock at={at} phone={phone} className="sheet-drawing">
      <figure className="sheet-fit" style={style}>
        {heading && (
          <p data-sheet-step="text" data-sheet-group={group} className="mb-1 font-ui text-xs font-semibold text-ink-green">
            {heading}
          </p>
        )}
        <div className="sheet-image">
          <div data-sheet-step="drawing" data-sheet-group={group}>
            <Image src={image.src} alt={alt} width={image.width} height={image.height} sizes={sizes} className="block h-auto w-full" />
          </div>
          {children}
        </div>
        <FigureCaption figure={figure} credit={credit} group={group} />
      </figure>
    </SheetBlock>
  );
}
