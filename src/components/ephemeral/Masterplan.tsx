"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { FigureCaption } from "@/components/sheet/Drawing";
import SheetBlock from "@/components/sheet/SheetBlock";
import SheetGrid from "@/components/sheet/SheetGrid";
import { bodyClass, headingClass, Lines } from "@/components/sheet/SheetText";
import { act4, images } from "@/content/ephemeral-ground";

const { masterplan, sheets } = act4;
const { key, north, text, image } = masterplan;

const keyRow =
  "flex w-full gap-2 py-0.5 text-left font-ui text-[length:var(--sheet-small)] leading-snug text-ink-green data-[active=true]:font-semibold data-[active=true]:text-accent-terracotta";

/** A leg: this sheet's arrival takes the camera to the plan. The gap keeps the plan's fade in view. */
export default function Masterplan({ title }: { title: string }) {
  // The key row or number under the mouse, or in focus: each lights up the other.
  const [active, setActive] = useState<number | null>(null);
  const { src, width, height } = images[image.name];
  const clear = () => setActive(null);

  return (
    <div data-act-leg className="lg:motion-safe:mt-[150svh]">
      <div data-act-card data-plan-leg>
        <SheetGrid id="masterplan" title={{ act: title, sheet: sheets.masterplan, north }} hold>
          <SheetBlock at="K1:L1" className="lg:pl-3">
            <h3 data-sheet-step="text" data-sheet-group={0} className={headingClass}>
              {masterplan.title}
            </h3>
          </SheetBlock>
          <SheetBlock type="stage-window" late at="A1:J6">
            <div data-plan-window className="sheet-plan" style={{ "--sheet-ratio": width / height } as CSSProperties}>
              <div data-sheet-step="drawing" data-sheet-group={0} className="sheet-window-fallback absolute inset-0">
                <Image src={src} alt={image.alt} fill sizes="(max-width: 1024px) 92vw, 75vw" />
              </div>
              {key.flatMap(({ number, at }) =>
                at.map(([left, top]) => (
                  <span
                    key={`${left}-${top}`}
                    aria-hidden="true"
                    data-active={active === number}
                    className="sheet-plan-number font-ui"
                    style={{ left: `${left}%`, top: `${top}%` }}
                    onMouseEnter={() => setActive(number)}
                    onMouseLeave={clear}
                  >
                    {number}
                  </span>
                )),
              )}
            </div>
            <div className="sheet-window-label sheet-plan-label">
              <FigureCaption figure={image.figure} credit={image.credit} />
            </div>
          </SheetBlock>
          <SheetBlock at="K2:L7" className="lg:pl-3">
            <ol data-sheet-step="text" data-sheet-group={0}>
              {key.map(({ number, name }) => (
                <li key={number}>
                  <button
                    type="button"
                    data-active={active === number}
                    className={keyRow}
                    onMouseEnter={() => setActive(number)}
                    onMouseLeave={clear}
                    onFocus={() => setActive(number)}
                    onBlur={clear}
                    onClick={() => setActive(number)}
                  >
                    <span className="w-[2ch] shrink-0 text-right">{number}.</span>
                    {name}
                  </button>
                </li>
              ))}
            </ol>
          </SheetBlock>
          <SheetBlock at="A7:J8" className="lg:pt-2">
            <Lines group={0} className={`${bodyClass} lg:max-w-none lg:columns-2 lg:gap-8`}>
              {text}
            </Lines>
          </SheetBlock>
        </SheetGrid>
      </div>
    </div>
  );
}
