import Image from "next/image";
import Drawing, { FigureCaption } from "@/components/sheet/Drawing";
import KeyPlan from "@/components/sheet/KeyPlan";
import SheetBlock from "@/components/sheet/SheetBlock";
import SheetGrid from "@/components/sheet/SheetGrid";
import { headingClass, Lines, nameClass, smallClass } from "@/components/sheet/SheetText";
import { act4, images } from "@/content/ephemeral-ground";

const { visitors, sheets } = act4;
const { material } = visitors;

// The plan, the section, her words, then the three materials in the order her text names them, then the key plan.
const SECTION = 1;
const TEXT = 2;
const SWATCHES = 3;
const KEY = SWATCHES + material.swatches.length;

/** Her p.21. Her swatches are small crops, so they stay at their real size. */
export default function VisitorsCenter({ title }: { title: string }) {
  return (
    <SheetGrid id="visitors-center" title={{ act: title, sheet: sheets.visitors }} slow hold>
      <Drawing
        image={images[visitors.plan.name]}
        alt={visitors.plan.alt}
        at="A1:H6"
        figure={visitors.plan.figure}
        scale={0.85}
        sizes="(max-width: 1024px) 92vw, 60vw"
      />
      <Drawing
        image={images[visitors.section.name]}
        alt={visitors.section.alt}
        at="A7:F8"
        figure={visitors.section.figure}
        group={SECTION}
        sizes="(max-width: 1024px) 92vw, 48vw"
      />
      <SheetBlock at="I1:L7">
        <h3 data-sheet-step="text" data-sheet-group={TEXT} className={headingClass}>
          {visitors.zone}
        </h3>
        <h4 data-sheet-step="text" data-sheet-group={TEXT} className={`${nameClass} mt-1`}>
          {visitors.title}
        </h4>
        <Lines group={TEXT} className={`${smallClass} mt-2`}>
          {visitors.text}
        </Lines>
        <div className="mt-2 mb-1 flex items-start gap-6">
          <h4 data-sheet-step="text" data-sheet-group={TEXT} className={nameClass}>
            {material.title}
          </h4>
          <ul className="flex flex-1 gap-3">
            {material.swatches.map(({ name, label }, i) => {
              const { src, width, height } = images[name];
              return (
                <li key={name} data-sheet-step="text" data-sheet-group={SWATCHES + i} className="flex-1 font-ui text-xs leading-tight text-ink-green">
                  <Image src={src} alt="" width={width} height={height} sizes="96px" className="sheet-swatch mb-1 rounded-full" />
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
        <Lines group={TEXT} className={smallClass}>
          {material.text}
        </Lines>
        <FigureCaption figure={material.figure} group={TEXT} />
      </SheetBlock>
      <KeyPlan
        heading={visitors.keyPlan.heading}
        image={images[visitors.keyPlan.name]}
        alt={visitors.keyPlan.alt}
        at="G7:H8"
        figure={visitors.keyPlan.figure}
        area={visitors.keyPlan.area}
        group={KEY}
        sizes="(max-width: 1024px) 92vw, 16vw"
      />
    </SheetGrid>
  );
}
