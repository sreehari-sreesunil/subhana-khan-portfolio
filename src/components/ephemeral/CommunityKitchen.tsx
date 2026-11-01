"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import PhotoViewer, { type ViewerPhoto } from "@/components/PhotoViewer";
import Drawing, { FigureCaption } from "@/components/sheet/Drawing";
import KeyPlan from "@/components/sheet/KeyPlan";
import SheetBlock from "@/components/sheet/SheetBlock";
import SheetGrid from "@/components/sheet/SheetGrid";
import { headingClass, Lines, smallClass } from "@/components/sheet/SheetText";
import { act4, images } from "@/content/ephemeral-ground";

const { kitchen, sheets } = act4;

const plans = images[kitchen.plans.name];
const photos: ViewerPhoto[] = [{ ...plans, alt: kitchen.plans.alt, caption: kitchen.plans.figure }];

// The plans and her dotted lines, her words, the elevation, the key plan.
const TEXT = 1;
const ELEVATION = 2;
const KEY = 3;

/** Her dotted lines, redrawn. A dotted pattern as the stroke keeps them dotted while the `callout` step draws them. */
function ProjectionLines() {
  const { width, height } = plans;
  return (
    <svg
      aria-hidden="true"
      data-sheet-step="callout"
      data-sheet-group={0}
      viewBox={`0 0 ${width} ${height}`}
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
    >
      <defs>
        <pattern id="kitchen-dots" width="8" height="5" patternUnits="userSpaceOnUse">
          <rect width="8" height="2.5" className="fill-ink-green" />
        </pattern>
      </defs>
      {kitchen.lines.map(([x, top, bottom]) => {
        const across = (x / 100) * width;
        return (
          <path
            key={x}
            d={`M${across} ${(top / 100) * height}V${(bottom / 100) * height}`}
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
            stroke="url(#kitchen-dots)"
            strokeWidth={3}
            fill="none"
          />
        );
      })}
    </svg>
  );
}

/** Her p.18. */
export default function CommunityKitchen({ title }: { title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const style = { "--sheet-ratio": plans.width / plans.height, "--sheet-scale": 0.9, "--sheet-caption": "2.75rem" } as CSSProperties;

  return (
    <>
      <SheetGrid id="community-kitchen" title={{ act: title, sheet: sheets.kitchen }} slow hold>
        <SheetBlock at="A1:F6" className="sheet-drawing">
          <figure className="sheet-fit" style={style}>
            <div className="sheet-image">
              <button
                type="button"
                aria-haspopup="dialog"
                data-sheet-step="drawing"
                data-sheet-group={0}
                onClick={() => setOpen(0)}
                className="block w-full cursor-zoom-in"
              >
                <Image src={plans.src} alt={kitchen.plans.alt} width={plans.width} height={plans.height} sizes="(max-width: 1024px) 92vw, 48vw" className="block h-auto w-full" />
              </button>
              <ProjectionLines />
              <p data-sheet-step="text" data-sheet-group={0} className={`${smallClass} absolute top-[43.8%] left-[18%] font-semibold`}>
                {kitchen.planNames.first}
              </p>
            </div>
            <p data-sheet-step="text" data-sheet-group={0} className={`${smallClass} mt-0.5 font-semibold lg:ml-[18%]`}>
              {kitchen.planNames.ground}
            </p>
            <FigureCaption figure={kitchen.plans.figure} />
          </figure>
        </SheetBlock>
        <SheetBlock at="G1:I1">
          <h3 data-sheet-step="text" data-sheet-group={TEXT} className={headingClass}>
            {kitchen.title}
          </h3>
        </SheetBlock>
        <SheetBlock at="G2:I6">
          <Lines group={TEXT}>{kitchen.text}</Lines>
        </SheetBlock>
        <KeyPlan
          heading={kitchen.keyPlan.heading}
          image={images[kitchen.keyPlan.name]}
          alt={kitchen.keyPlan.alt}
          at="J1:L3"
          figure={kitchen.keyPlan.figure}
          area={kitchen.keyPlan.area}
          group={KEY}
          sizes="(max-width: 1024px) 92vw, 24vw"
        />
        <SheetBlock at="J4:L6">
          <Lines group={TEXT}>{kitchen.adapts}</Lines>
        </SheetBlock>
        <Drawing
          image={images[kitchen.elevation.name]}
          alt={kitchen.elevation.alt}
          at="A7:I8"
          figure={kitchen.elevation.figure}
          group={ELEVATION}
          sizes="(max-width: 1024px) 92vw, 72vw"
        />
      </SheetGrid>
      <PhotoViewer photos={photos} index={open} onChange={setOpen} />
    </>
  );
}
