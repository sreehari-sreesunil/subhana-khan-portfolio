import Image from "next/image";
import type { CSSProperties } from "react";
import Drawing, { FigureCaption } from "@/components/sheet/Drawing";
import SheetBlock from "@/components/sheet/SheetBlock";
import SheetGrid from "@/components/sheet/SheetGrid";
import { bodyClass, headingClass, Lines, Name, smallClass } from "@/components/sheet/SheetText";
import { act1, act2, images, type TextPart } from "@/content/ephemeral-ground";
import { StaticFrame } from "./StoryFrames";

export const withBold = (parts: TextPart[]) => parts.map((part) => (part.bold ? <strong key={part.text}>{part.text}</strong> : part.text));

// Her arches keep the sizes they have on her sheet, so all four are measured against the tallest.
const TALLEST_ARCH = Math.max(...act2.philosophers.map((person) => images[person.image.name].height));

/** Her p.23: the four arches in a row, each with its name and caption beneath. */
export function PhilosophersSheet({ act }: { act: string }) {
  return (
    <SheetGrid title={{ act, sheet: act2.philosophersSheet }} slow hold>
      <SheetBlock at="K1:L3">
        <h3 data-sheet-step="text" data-sheet-group={0} className={headingClass}>
          {act2.philosophersTitle}
        </h3>
      </SheetBlock>
      <SheetBlock at="A1:J8" className="sheet-arcade">
        {act2.philosophers.map((person, group) => {
          const { src, width, height } = images[person.image.name];
          return (
            <figure key={person.name} className="sheet-arch" style={{ "--arch": group + 1 } as CSSProperties}>
              <div className="sheet-arch-image sheet-drawing sheet-standing">
                <div className="sheet-fit" style={{ "--sheet-ratio": width / height, "--sheet-scale": height / TALLEST_ARCH } as CSSProperties}>
                  <div className="sheet-image">
                    <div data-sheet-step="drawing" data-sheet-group={group}>
                      <Image src={src} alt={person.image.alt} width={width} height={height} sizes="(max-width: 1024px) 92vw, 20vw" className="block h-auto w-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="sheet-arch-text">
                <Name group={group}>{person.name}</Name>
                <Lines group={group} className={smallClass}>
                  {withBold(person.caption)}
                </Lines>
                <FigureCaption figure={person.figure} credit={person.image.credit} group={group} />
              </div>
            </figure>
          );
        })}
      </SheetBlock>
    </SheetGrid>
  );
}

type Project = (typeof act2.application)[number];

function ProjectText({ project, group, at, heading, className }: { project: Project; group: number; at: string; heading?: string; className?: string }) {
  return (
    <SheetBlock at={at} className={className}>
      {heading && (
        <h3 data-sheet-step="text" data-sheet-group={group} className={`${headingClass} mb-3`}>
          {heading}
        </h3>
      )}
      <Name group={group}>{project.name}</Name>
      <Lines group={group}>{project.text}</Lines>
    </SheetBlock>
  );
}

function ProjectDrawing({ project, group, at, sizes }: { project: Project; group: number; at: string; sizes: string }) {
  return <Drawing image={images[project.image.name]} alt={project.image.alt} at={at} figure={project.figure} credit={project.image.credit} group={group} sizes={sizes} />;
}

/** Her p.24 in two sheets, keeping her order, so each pair can have one large drawing. */
export function ApplicationSheets({ act }: { act: string }) {
  const [library, hall, residential, housing] = act2.application;
  const title = { act, sheet: act2.applicationSheet };
  return (
    <>
      <SheetGrid title={title} slow hold>
        <ProjectDrawing project={library} group={0} at="A1:F8" sizes="(max-width: 1024px) 92vw, 50vw" />
        <ProjectText project={library} group={0} at="G1:I5" heading={act2.applicationTitle} className="lg:pl-4" />
        <ProjectDrawing project={hall} group={1} at="J1:L4" sizes="(max-width: 1024px) 92vw, 24vw" />
        <ProjectText project={hall} group={1} at="J5:L7" className="lg:pt-3" />
      </SheetGrid>
      <SheetGrid title={title} slow hold>
        <ProjectDrawing project={housing} group={0} at="A1:I6" sizes="(max-width: 1024px) 92vw, 72vw" />
        <ProjectText project={housing} group={0} at="A7:E8" />
        <ProjectDrawing project={residential} group={1} at="J1:L4" sizes="(max-width: 1024px) 92vw, 24vw" />
        <ProjectText project={residential} group={1} at="J5:L7" className="lg:pt-3" />
      </SheetGrid>
    </>
  );
}

export function IslandSheets({ act }: { act: string }) {
  const { island } = act2;
  const { focus, scale } = act1.stops[2];
  const title = { act, sheet: island.sheet };
  const [slope, terrain, access] = island.diagrams;
  return (
    <>
      <SheetGrid id="a-different-logic" title={title} slow hold>
        <SheetBlock type="stage-window" at="A1:F8" fallback={<StaticFrame bare focus={focus} scale={scale} ratio={0.9} alt={act1.people.frameAlt} />}>
          <div className="sheet-window-label">
            <FigureCaption figure={island.window.figure} credit={island.window.credit} />
          </div>
        </SheetBlock>
        <Drawing
          image={images[island.collage.name]}
          alt={island.collage.alt}
          at="G1:I6"
          figure={island.collage.figure}
          sizes="(max-width: 1024px) 92vw, 26vw"
        />
        <SheetBlock at="J1:L4" className="lg:pl-4">
          <Lines group={0}>{island.key}</Lines>
        </SheetBlock>
        <SheetBlock at="J5:L7" className="lg:pl-4">
          <Lines group={0}>{island.closing}</Lines>
        </SheetBlock>
      </SheetGrid>
      <div className="lg:motion-safe:mt-[60svh]">
        <SheetGrid id="terrain-diagrams" title={title} slow hold>
          <Drawing image={images[slope.image.name]} alt={slope.image.alt} at="A1:I5" figure={slope.figure} group={0} sizes="(max-width: 1024px) 92vw, 72vw" />
          <SheetBlock at="A6:F7">
            {slope.text.map((line) => (
              <Lines key={line} group={0} className={`${bodyClass} mb-2`}>
                {line}
              </Lines>
            ))}
          </SheetBlock>
          <Drawing image={images[terrain.image.name]} alt={terrain.image.alt} at="J1:L3" figure={terrain.figure} group={1} sizes="(max-width: 1024px) 92vw, 24vw" />
          <Drawing image={images[access.image.name]} alt={access.image.alt} at="J4:L7" figure={access.figure} group={2} sizes="(max-width: 1024px) 92vw, 24vw" />
        </SheetGrid>
      </div>
    </>
  );
}
