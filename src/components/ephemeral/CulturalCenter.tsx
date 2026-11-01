import Drawing from "@/components/sheet/Drawing";
import KeyPlan from "@/components/sheet/KeyPlan";
import SheetBlock from "@/components/sheet/SheetBlock";
import SheetGrid from "@/components/sheet/SheetGrid";
import { headingClass, Lines, smallClass } from "@/components/sheet/SheetText";
import { act4, images } from "@/content/ephemeral-ground";

const { cultural, sheets } = act4;

// The plan, the section, her words, the key plan.
const SECTION = 1;
const TEXT = 2;
const KEY = 3;

/** Her p.22, without its news clipping: that photo shows a Jarawa person, so the article is cited in words. */
export default function CulturalCenter({ title }: { title: string }) {
  return (
    <SheetGrid id="cultural-center" title={{ act: title, sheet: sheets.cultural }} slow hold>
      <Drawing
        image={images[cultural.plan.name]}
        alt={cultural.plan.alt}
        at="A1:G6"
        figure={cultural.plan.figure}
        scale={0.9}
        sizes="(max-width: 1024px) 92vw, 52vw"
      />
      <Drawing
        image={images[cultural.section.name]}
        alt={cultural.section.alt}
        at="A7:F8"
        figure={cultural.section.figure}
        group={SECTION}
        sizes="(max-width: 1024px) 92vw, 56vw"
      />
      <SheetBlock at="H1:J1">
        <h3 data-sheet-step="text" data-sheet-group={TEXT} className={headingClass}>
          {cultural.title}
        </h3>
      </SheetBlock>
      <SheetBlock at="H2:J5">
        <Lines group={TEXT} className={smallClass}>
          {cultural.text}
        </Lines>
      </SheetBlock>
      <SheetBlock at="H6:J8">
        <Lines group={TEXT} className={smallClass}>
          {cultural.busStop}
        </Lines>
      </SheetBlock>
      <KeyPlan
        heading={cultural.keyPlan.heading}
        image={images[cultural.keyPlan.name]}
        alt={cultural.keyPlan.alt}
        at="K1:L3"
        figure={cultural.keyPlan.figure}
        area={cultural.keyPlan.area}
        group={KEY}
        sizes="(max-width: 1024px) 92vw, 16vw"
      />
      <SheetBlock at="K4:L7">
        <Lines group={TEXT} className={smallClass}>
          {cultural.tourism}
        </Lines>
        <p data-sheet-step="text" data-sheet-group={TEXT} className="sheet-caption font-ui">
          {cultural.source}
        </p>
      </SheetBlock>
    </SheetGrid>
  );
}
