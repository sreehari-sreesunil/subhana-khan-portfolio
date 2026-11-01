import Drawing from "@/components/sheet/Drawing";
import SheetBlock from "@/components/sheet/SheetBlock";
import SheetGrid from "@/components/sheet/SheetGrid";
import { headingClass, Lines, nameClass, smallClass } from "@/components/sheet/SheetText";
import { act4, images } from "@/content/ephemeral-ground";

const { tsunami, sheets } = act4;

// The plan and legend, then the tower, then her text, then her three layers one at a time.
const RENDER = 1;
const TEXT = 2;
const LAYERS = 3;

export default function TsunamiDesign({ title }: { title: string }) {
  return (
    <SheetGrid id="tsunami" title={{ act: title, sheet: sheets.tsunami }} slow hold>
      <SheetBlock at="A1:H1">
        <h3 data-sheet-step="text" data-sheet-group={0} className={headingClass}>
          {tsunami.title}
        </h3>
      </SheetBlock>
      <Drawing
        image={images[tsunami.plan.name]}
        alt={tsunami.plan.alt}
        at="A2:H7"
        figure={tsunami.plan.figure}
        sizes="(max-width: 1024px) 92vw, 64vw"
      />
      <SheetBlock at="A8:H8">
        <div data-sheet-step="text" data-sheet-group={0}>
          <p className={`${nameClass} mb-1`}>{tsunami.legendTitle}</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 lg:flex lg:flex-wrap lg:gap-x-6">
            {tsunami.legend.map(({ name, colour }) => (
              <li key={name} className={`${smallClass} flex items-center gap-2`}>
                <span aria-hidden="true" className="size-3 shrink-0 rounded-full" style={{ background: colour }} />
                {name}
              </li>
            ))}
          </ul>
        </div>
      </SheetBlock>
      <Drawing
        image={images[tsunami.render.name]}
        alt={tsunami.render.alt}
        at="I1:L2"
        figure={tsunami.render.figure}
        group={RENDER}
        sizes="(max-width: 1024px) 92vw, 32vw"
      />
      <SheetBlock at="I3:L7">
        <Lines group={TEXT}>{tsunami.text}</Lines>
      </SheetBlock>
      <SheetBlock at="I8:J8">
        <ol>
          {tsunami.layers.map((layer, i) => (
            <li key={layer} data-sheet-step="text" data-sheet-group={LAYERS + i} className={`${smallClass} border-t border-accent-terracotta/40 py-0.5`}>
              {layer}
            </li>
          ))}
        </ol>
      </SheetBlock>
    </SheetGrid>
  );
}
