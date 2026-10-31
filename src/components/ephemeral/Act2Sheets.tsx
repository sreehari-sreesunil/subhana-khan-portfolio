import type { ReactNode } from "react";
import Callout from "@/components/sheet/Callout";
import Drawing from "@/components/sheet/Drawing";
import Inhabitant from "@/components/sheet/Inhabitant";
import SheetBlock from "@/components/sheet/SheetBlock";
import SheetGrid from "@/components/sheet/SheetGrid";
import { act2, images, type TextPart } from "@/content/ephemeral-ground";
import { hero } from "@/content/home";

const titleClass = "font-heading text-[clamp(1.35rem,2vw,1.9rem)] leading-tight font-semibold text-ink-green";
const nameClass = "font-heading text-[clamp(1.35rem,2.2vw,2.1rem)] leading-tight font-semibold text-ink-green";
const bodyClass = "mt-3 font-body text-[clamp(1rem,1.35vw,1.3rem)] leading-relaxed text-ink-green";
const creditClass = "mt-3 font-ui text-[11px] leading-snug text-ink-green/70";

export const withBold = (parts: TextPart[]) => parts.map((part) => (part.bold ? <strong key={part.text}>{part.text}</strong> : part.text));

function figure(id: string) {
  const image = hero.figures.find((item) => item.id === id)?.image;
  if (!image) throw new Error(`No figure: ${id}`);
  return image;
}

function Lines({ group, className = bodyClass, children }: { group: number; className?: string; children: ReactNode }) {
  return (
    <p data-sheet-step="text" data-sheet-group={group} data-sheet-lines className={className}>
      {children}
    </p>
  );
}

type Philosopher = (typeof act2.philosophers)[number];

/** One arch, with its callout beside it and her caption above that. Arches keep their sizes from her sheet. */
function Arch({ person, group, at, cropAt, textAt, scale, children }: { person: Philosopher; group: number; at: string; cropAt: string; textAt: string; scale?: number; children?: ReactNode }) {
  return (
    <>
      <Callout
        image={images[person.image.name]}
        alt={person.image.alt}
        at={at}
        cropAt={cropAt}
        cropPhone={children ? "span 3" : undefined}
        spot={person.callout}
        scale={scale}
        group={group}
        sizes="(max-width: 1024px) 92vw, 26vw"
      />
      {children}
      <SheetBlock at={textAt}>
        <h4 data-sheet-step="text" data-sheet-group={group} className={nameClass}>
          {person.name}
        </h4>
        <Lines group={group}>{withBold(person.caption)}</Lines>
        {person.image.credit && (
          <p data-sheet-step="text" data-sheet-group={group} className={creditClass}>
            {person.image.credit}
          </p>
        )}
      </SheetBlock>
    </>
  );
}

export function PhilosophersSheets({ act }: { act: string }) {
  const [rosa, pallasmaa, tanizaki, zumthor] = act2.philosophers;
  const title = { act, sheet: act2.philosophersSheet };
  return (
    <>
      <SheetGrid title={title} slow hold>
        <SheetBlock at="D1:F1">
          <h3 data-sheet-step="text" data-sheet-group={0} className={titleClass}>
            {act2.philosophersTitle}
          </h3>
        </SheetBlock>
        <Arch person={rosa} group={0} at="A1:C8" textAt="D2:F4" cropAt="D5:E7" scale={0.94}>
          <Inhabitant image={figure("leaning-woman")} at="F5:F8" />
        </Arch>
        <Arch person={pallasmaa} group={1} at="G1:I8" textAt="J1:L3" cropAt="J4:L7" scale={0.94} />
      </SheetGrid>
      <SheetGrid title={title} slow hold>
        <Arch person={tanizaki} group={0} at="A1:C6" textAt="D1:F3" cropAt="D4:F7">
          <Inhabitant image={figure("yellow-dress-woman")} at="B7:C8" />
        </Arch>
        <Arch person={zumthor} group={1} at="G1:I8" textAt="J1:L3" cropAt="J4:L7" />
      </SheetGrid>
    </>
  );
}

export function IslandSheets({ act }: { act: string }) {
  const { island } = act2;
  const title = { act, sheet: island.sheet };
  const [terrain, slope, access] = island.diagrams;
  return (
    <>
      <SheetGrid id="a-different-logic" title={title} slow hold>
        <Callout
          image={images[island.collage.name]}
          alt={island.collage.alt}
          at="A1:F8"
          cropAt="J4:L7"
          cropPhone="span 3"
          spot={island.collageCallout}
          sizes="(max-width: 1024px) 92vw, 45vw"
        />
        <Inhabitant image={figure("children")} at="G7:H8" />
        <SheetBlock at="G1:L3">
          <Lines group={0} className="font-body text-[clamp(1rem,1.3vw,1.25rem)] leading-relaxed text-ink-green">
            {island.key}
          </Lines>
        </SheetBlock>
        <SheetBlock at="G4:I6">
          <Lines group={0} className="font-body text-[clamp(1rem,1.3vw,1.25rem)] leading-relaxed text-ink-green">
            {island.closing}
          </Lines>
        </SheetBlock>
      </SheetGrid>
      <div className="lg:motion-safe:mt-[60svh]">
        <SheetGrid id="terrain-diagrams" title={title} slow hold>
          <Callout
            image={images[slope.image.name]}
            alt={slope.image.alt}
            at="A1:H5"
            cropAt="J3:L6"
            cropPhone="span 3"
            spot={island.slopeCallout}
            label={slope.title}
            group={0}
            sizes="(max-width: 1024px) 92vw, 62vw"
          />
          <Inhabitant image={figure("walking-woman")} at="I7:J8" walk={110} />
          <SheetBlock at="I1:L2">
            {slope.text.map((line) => (
              <Lines key={line} group={0} className="mb-2 font-body text-[clamp(0.95rem,1.1vw,1.1rem)] leading-snug text-ink-green">
                {line}
              </Lines>
            ))}
          </SheetBlock>
          <Drawing
            image={images[terrain.image.name]}
            alt={terrain.image.alt}
            at="A6:D8"
            label={terrain.title}
            group={1}
            sizes="(max-width: 1024px) 92vw, 31vw"
          />
          <Drawing
            image={images[access.image.name]}
            alt={access.image.alt}
            at="E6:H8"
            label={access.title}
            group={2}
            sizes="(max-width: 1024px) 92vw, 31vw"
          />
        </SheetGrid>
      </div>
    </>
  );
}
