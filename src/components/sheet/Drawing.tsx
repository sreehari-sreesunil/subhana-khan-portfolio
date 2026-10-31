import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import SheetBlock from "./SheetBlock";

export type SheetImage = { src: string; width: number; height: number };

export type DrawingProps = {
  image: SheetImage;
  alt: string;
  at: string;
  phone?: string;
  sizes: string;
  /** Reveal group: each drawing, its callout and its text play together, in group order. */
  group?: number;
  /** Size against the cell's height, so drawings on one sheet can keep their relative scale. */
  scale?: number;
  /** Small title over the drawing's corner. */
  label?: string;
  /** Sits above the drawing, unclipped by its wipe: the callout's circle. */
  children?: ReactNode;
};

/** A drawing filling its cells, keeping its proportions. Its box is exactly the image, so overlays can use percentages. */
export default function Drawing({ image, alt, at, phone, sizes, group = 0, scale, label, children }: DrawingProps) {
  const fit = { "--sheet-ratio": image.width / image.height, "--sheet-scale": scale } as CSSProperties;
  return (
    <SheetBlock at={at} phone={phone} className="sheet-drawing">
      <figure className="sheet-fit" style={fit}>
        <div data-sheet-step="drawing" data-sheet-group={group}>
          <Image src={image.src} alt={alt} width={image.width} height={image.height} sizes={sizes} className="block h-auto w-full" />
        </div>
        {label && (
          <figcaption data-sheet-step="text" data-sheet-group={group} className="absolute top-1 left-1 font-heading text-[clamp(1rem,1.3vw,1.25rem)] font-semibold text-ink-green">
            {label}
          </figcaption>
        )}
        {children}
      </figure>
    </SheetBlock>
  );
}
