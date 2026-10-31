import Image from "next/image";
import type { CSSProperties } from "react";
import { FigureCaption, type SheetImage } from "./Drawing";
import SheetBlock from "./SheetBlock";

type RowDrawing = { image: SheetImage; alt: string; figure: string; credit?: string };

type DrawingRowProps = {
  drawings: RowDrawing[];
  at: string;
  phone?: string;
  sizes: string;
  /** A small heading above the row. */
  heading?: string;
  group?: number;
};

// Room kept under the row for captions in narrow columns.
const CAPTION = "3.25rem";
const HEADING = "1.25rem";

/** Drawings side by side at one height: each column's width follows its drawing's shape. */
export default function DrawingRow({ drawings, at, phone, sizes, heading, group = 0 }: DrawingRowProps) {
  const ratios = drawings.map(({ image }) => image.width / image.height);
  const style = {
    "--sheet-ratio": ratios.reduce((sum, ratio) => sum + ratio, 0),
    "--sheet-caption": heading ? `calc(${CAPTION} + ${HEADING})` : CAPTION,
  } as CSSProperties;
  return (
    <SheetBlock at={at} phone={phone} className="sheet-drawing">
      <div className="sheet-fit" style={style}>
        {heading && (
          <p data-sheet-step="text" data-sheet-group={group} className="mb-1 font-ui text-xs font-semibold text-ink-green">
            {heading}
          </p>
        )}
        <div className="grid gap-1.5" style={{ gridTemplateColumns: ratios.map((ratio) => `minmax(0, ${ratio}fr)`).join(" ") }}>
          {drawings.map(({ image, alt, figure, credit }) => (
            <figure key={image.src} className="min-w-0">
              <div data-sheet-step="drawing" data-sheet-group={group}>
                <Image src={image.src} alt={alt} width={image.width} height={image.height} sizes={sizes} className="block h-auto w-full" />
              </div>
              <FigureCaption figure={figure} credit={credit} group={group} />
            </figure>
          ))}
        </div>
      </div>
    </SheetBlock>
  );
}
