import type { CSSProperties, ReactNode } from "react";

const COLUMNS = "ABCDEFGHIJKL";

/** "A1:C8" reads like a drawing's own grid references: columns A–L, rows 1–8. */
function cells(at: string) {
  const match = /^([A-L])([1-8]):([A-L])([1-8])$/.exec(at);
  if (!match) throw new Error(`Bad sheet cell: ${at}`);
  const [, left, top, right, bottom] = match;
  const column = COLUMNS.indexOf(left) + 1;
  const row = Number(top);
  return {
    "--sheet-col": `${column} / span ${COLUMNS.indexOf(right) + 2 - column}`,
    "--sheet-row": `${row} / span ${Number(bottom) + 1 - row}`,
  };
}

type SheetBlockProps = {
  /** Cells on the 12×8 desktop grid, e.g. "A1:C8". */
  at: string;
  /** Column placement on the 4-column phone grid. */
  phone?: string;
  /** "stage-window": a transparent framed area that shows the camera stage behind the sheet. */
  type?: "stage-window";
  /** What a stage-window shows where there's no stage: phones, reduced motion, no JavaScript. */
  fallback?: ReactNode;
  className?: string;
  children?: ReactNode;
};

export default function SheetBlock({ at, phone = "span 4", type, fallback, className = "", children }: SheetBlockProps) {
  const style = { ...cells(at), "--sheet-phone": phone } as CSSProperties;
  if (type === "stage-window") {
    return (
      <div data-stage-window style={style} className={`sheet-block sheet-window ${className}`}>
        <div className="sheet-window-fallback">{fallback}</div>
        {children}
      </div>
    );
  }
  return (
    <div style={style} className={`sheet-block ${className}`}>
      {children}
    </div>
  );
}
