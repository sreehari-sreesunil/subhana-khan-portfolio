import type { CSSProperties } from "react";
import Drawing, { type DrawingProps } from "./Drawing";

/** The area this sheet shows, as fractions of the plan. */
export type KeyPlanArea = { left: number; top: number; width: number; height: number };

type KeyPlanProps = Omit<DrawingProps, "children"> & { area: KeyPlanArea };

/** Her own device, from pp.18 and 22: the plan small, a dashed box round the area this sheet shows. */
export default function KeyPlan({ area, ...drawing }: KeyPlanProps) {
  const { group = 0 } = drawing;
  const box: CSSProperties = {
    left: `${area.left * 100}%`,
    top: `${area.top * 100}%`,
    width: `${area.width * 100}%`,
    height: `${area.height * 100}%`,
  };
  return (
    <Drawing {...drawing}>
      <span data-sheet-step="callout" data-sheet-group={group} className="sheet-key-area" style={box} />
    </Drawing>
  );
}
