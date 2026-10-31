import { sheetLabels } from "@/content/ephemeral-ground";

export type TitleBlockProps = {
  act: string;
  /** Her original sheet number. */
  sheet: string;
  /** Only where the drawing states one. */
  scale?: string;
  /** Degrees clockwise from up. Only where the drawing has a north arrow. */
  north?: number;
};

/** Bottom-right box of the sheet. Phones: one slim line. */
export default function TitleBlock({ act, sheet, scale, north }: TitleBlockProps) {
  return (
    <div data-sheet-chrome className="sheet-title font-ui text-accent-terracotta">
      <p className="font-semibold">{sheetLabels.project}</p>
      <p>{act}</p>
      <p>
        {sheetLabels.sheet} {sheet}
      </p>
      {scale && (
        <p>
          {sheetLabels.scale} {scale}
        </p>
      )}
      {north !== undefined && (
        <svg role="img" aria-label={sheetLabels.north} viewBox="0 0 24 24" className="sheet-north" style={{ transform: `rotate(${north}deg)` }}>
          <path d="M12 2 18 21 12 17 6 21Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M12 2V17L6 21Z" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}
