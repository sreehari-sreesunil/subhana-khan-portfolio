import Image from "next/image";
import type { ReactNode } from "react";
import Drawing, { FigureCaption } from "@/components/sheet/Drawing";
import DrawingRow from "@/components/sheet/DrawingRow";
import SheetBlock from "@/components/sheet/SheetBlock";
import SheetGrid from "@/components/sheet/SheetGrid";
import { bodyClass, headingClass, Lines, Name, nameClass, smallClass } from "@/components/sheet/SheetText";
import { act1, images, type EgFigure } from "@/content/ephemeral-ground";
import { ephemeralGroundPreview as home } from "@/content/home";
import { MAP_H, MAP_W } from "@/lib/ephemeral-geometry";
import ProposalSheet from "./ProposalSheet";
import { StaticFrame } from "./StoryFrames";
import ZoneShapes, { zoneColours } from "./ZoneShapes";

const MAP_RATIO = MAP_W / MAP_H;
const COLUMNS = ["A1:C3", "D1:F3", "G1:I3", "J1:L3"];
const COLUMN_DRAWINGS = ["A4:C7", "D4:F7", "G4:I7", "J4:L7"];

function StageWindow({ at, figure, frame }: { at: string; figure: string; frame: ReactNode }) {
  return (
    <SheetBlock type="stage-window" at={at} fallback={frame}>
      <div className="sheet-window-label">
        <FigureCaption figure={figure} credit={act1.coastlineCredit} />
      </div>
    </SheetBlock>
  );
}

const asDrawing = ({ name, alt, figure, credit }: EgFigure) => ({ image: images[name], alt, figure, credit });

function ZoneKey() {
  return (
    <ul className="space-y-[0.55em] font-ui text-[length:var(--sheet-small)] leading-tight text-ink-green">
      {act1.proposal.zones.map(({ id, marker, label }, i) => (
        <li key={id} data-sheet-step="text" data-sheet-group={i + 1} className="flex items-center gap-2">
          <span aria-hidden="true" className="size-3 shrink-0" style={{ background: id === "power" ? "transparent" : zoneColours[id] }} />
          <span aria-hidden="true" className="grid size-[1.35em] shrink-0 place-items-center rounded-full bg-ink-green text-[0.8em] font-bold text-paper empty:bg-transparent">
            {marker}
          </span>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}

function ProposalFrame({ id }: { id: string }) {
  const { focus, scale } = act1.stops[2];
  return (
    <StaticFrame bare focus={focus} scale={scale} ratio={0.9} alt={act1.proposal.windowAlt}>
      <svg data-sheet-step="callout" data-sheet-group={0} aria-hidden="true" viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 size-full overflow-visible">
        <ZoneShapes id={id} marker={0.45} />
      </svg>
    </StaticFrame>
  );
}

function ProposalSheets({ act }: { act: string }) {
  const { proposal, sheets } = act1;
  const title = { act, sheet: sheets.island };
  const afterKey = proposal.zones.length + 1;
  return (
    <div id="proposal">
      <ProposalSheet title={title}>
        <StageWindow at="A1:F8" figure={proposal.windowFigure} frame={<ProposalFrame id="frame-zones-a" />} />
        <SheetBlock at="G1:L1" className="lg:pl-4">
          <h3 data-sheet-step="text" data-sheet-group={0} className={headingClass}>
            {proposal.title}
          </h3>
        </SheetBlock>
        <SheetBlock at="G2:I5" className="lg:pl-4">
          <ZoneKey />
        </SheetBlock>
        <Drawing
          image={images[proposal.map.name]}
          alt={proposal.map.alt}
          at="J2:L5"
          figure={proposal.map.figure}
          credit={proposal.map.credit}
          group={afterKey}
          captionLines={5}
          sizes="(max-width: 1024px) 92vw, 20vw"
        />
        <SheetBlock at="G6:L7" className="lg:pl-4">
          <h4 data-sheet-step="text" data-sheet-group={afterKey} className={`${nameClass} mb-3`}>
            {proposal.scaleTitle}
          </h4>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-4">
            {proposal.scale.map((item) => (
              <div key={item.value} data-sheet-step="text" data-sheet-group={afterKey}>
                <dd className={nameClass}>{item.value}</dd>
                <dt className={`${smallClass} mt-1`}>{item.label}</dt>
              </div>
            ))}
          </dl>
        </SheetBlock>
      </ProposalSheet>

      <SheetGrid title={title} hold>
        <StageWindow at="A1:F8" figure={proposal.windowFigure} frame={<ProposalFrame id="frame-zones-b" />} />
        {/* Not a size container: that would stop the icons' white from blending into the paper. */}
        <SheetBlock at="G1:L6" className="lg:pl-4 lg:[container-type:normal]!">
          <ul className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {proposal.projects.map((project, group) => {
              const icon = images[project.icon];
              return (
                <li key={project.title}>
                  <Image
                    data-sheet-step="text"
                    data-sheet-group={group}
                    src={icon.src}
                    alt=""
                    width={icon.width}
                    height={icon.height}
                    sizes="80px"
                    className="mb-2 h-[clamp(2.5rem,7svh,3.75rem)] w-auto mix-blend-multiply"
                  />
                  <Name group={group}>{project.title}</Name>
                  {project.text.map((line) => (
                    <p key={line} data-sheet-step="text" data-sheet-group={group} className={`${smallClass} mb-1`}>
                      {line}
                    </p>
                  ))}
                </li>
              );
            })}
          </ul>
          <p data-sheet-step="text" data-sheet-group={proposal.projects.length} className="sheet-caption font-ui">
            {proposal.iconsCredit}
          </p>
        </SheetBlock>
        <SheetBlock at="G7:J8" className="lg:pl-4">
          <ul className="grid grid-cols-3 gap-3">
            {proposal.population.map((group) => (
              <li key={group.label} data-sheet-step="text" data-sheet-group={proposal.projects.length}>
                <p className={nameClass}>{group.value}</p>
                <p className={`${smallClass} mt-1`}>{group.label}</p>
                <p className="sheet-caption font-ui">{group.note}</p>
              </li>
            ))}
          </ul>
        </SheetBlock>
      </SheetGrid>
    </div>
  );
}

/** Her two population figures, set large. */
function PopulationFigure({ at, group, figure, source }: { at: string; group: number; figure: string; source?: string }) {
  const { populationFrom, populationTo } = act1.proposal;
  const number = (text: string) => {
    const [value, ...note] = text.split(" ");
    return (
      <p className="flex items-baseline gap-2">
        <span className="font-heading text-[clamp(2.25rem,min(3.5vw,6.4svh),3.5rem)] leading-none font-bold">{value}</span>
        <span className="font-ui text-[length:var(--sheet-small)]">{note.join(" ")}</span>
      </p>
    );
  };
  return (
    <SheetBlock at={at}>
      <figure>
        <div data-sheet-step="drawing" data-sheet-group={group} className="text-ink-green">
          {number(populationFrom)}
          <p className="my-1 font-heading text-[length:var(--sheet-heading)] font-bold text-accent-terracotta">
            <span aria-hidden="true">››</span>
            <span className="sr-only">to</span>
          </p>
          {number(populationTo)}
        </div>
        <FigureCaption figure={figure} credit={source} group={group} />
      </figure>
    </SheetBlock>
  );
}

function StakeSheet({ act }: { act: string }) {
  return (
    <SheetGrid id="at-stake" title={{ act, sheet: act1.sheets.stake }} hold>
      {act1.stake.map((column, group) => (
        <div key={column.title} className="contents">
          <SheetBlock at={COLUMNS[group]} className="lg:pr-3">
            <Name group={group}>{column.title}</Name>
            <Lines group={group} className={smallClass}>
              {column.text}
            </Lines>
          </SheetBlock>
          {column.numbersFigure ? (
            <PopulationFigure at={COLUMN_DRAWINGS[group]} group={group} figure={column.numbersFigure} source={column.source} />
          ) : (
            <DrawingRow at={COLUMN_DRAWINGS[group]} group={group} drawings={column.images.map(asDrawing)} sizes="(max-width: 1024px) 46vw, 24vw" />
          )}
        </div>
      ))}
    </SheetGrid>
  );
}

const cell = "px-[0.3em] text-right whitespace-nowrap tabular-nums lg:px-[0.9em]";

function Count({ value }: { value: string }) {
  const count = value.replace("*", "");
  return (
    <td className={`${cell} ${count === "–" ? "text-ink-green/45" : ""}`}>
      <span className="relative">
        {count}
        {value.endsWith("*") && <span className="sheet-star">*</span>}
      </span>
    </td>
  );
}

function GrowthRate({ value }: { value: string }) {
  const [whole, decimals] = value.split(".");
  return (
    <td className={`${cell} ${value === "–" ? "text-ink-green/45" : ""}`}>
      {whole}
      <span className="sheet-decimal">{decimals && `.${decimals}`}</span>
    </td>
  );
}

function LessonsTable({ group }: { group: number }) {
  const { lessons } = act1;
  return (
    <SheetBlock at="A1:H8" className="overflow-x-auto lg:overflow-visible">
      {/* Its height leaves room for the caption, which a table draws outside its own height. */}
      <table data-sheet-step="drawing" data-sheet-group={group} className="w-full min-w-[20rem] border-collapse font-ui text-[0.75rem] text-ink-green lg:h-[calc(100cqh-2.5rem)] lg:text-[length:var(--sheet-body)]">
        <caption data-sheet-step="text" data-sheet-group={group} className="sheet-caption caption-bottom text-left font-ui">
          <span className="sheet-caption-title">{lessons.tableCaption}</span>
          {lessons.tableCredit}
        </caption>
        <thead>
          <tr className="border-b-2 border-ink-green align-bottom font-heading text-[0.65rem] leading-tight font-semibold lg:text-[length:var(--sheet-small)]">
            {lessons.tableHead.map((column, i) => (
              <th key={column} scope="col" className={`pb-[0.5em] font-semibold ${i ? "px-[0.3em] text-right lg:px-[0.9em]" : "pr-[0.3em] text-left"}`}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lessons.tableRows.map(([year, ...cells]) => (
            <tr key={year} data-sheet-step="text" data-sheet-group={group} className="border-b border-ink-green/20">
              <th scope="row" className={`pr-[0.6em] text-left font-bold tabular-nums ${cells.every((value) => value === "–") ? "text-ink-green/45" : ""}`}>
                {year}
              </th>
              {cells.slice(0, -1).map((value, i) => (
                <Count key={i} value={value} />
              ))}
              <GrowthRate value={cells[cells.length - 1]} />
            </tr>
          ))}
        </tbody>
      </table>
    </SheetBlock>
  );
}

function LessonsSheet({ act }: { act: string }) {
  const { lessons, sheets } = act1;
  return (
    <SheetGrid id="lessons" title={{ act, sheet: sheets.stake }} hold>
      <LessonsTable group={0} />
      <SheetBlock at="I1:L3" className="lg:pl-4">
        <h3 data-sheet-step="text" data-sheet-group={1} className={`${headingClass} mb-3`}>
          {lessons.title}
        </h3>
        <Lines group={1}>{lessons.text}</Lines>
      </SheetBlock>
      <div className="contents lg:[&>.sheet-block]:pl-4">
        <Drawing
          image={images[lessons.maps.name]}
          alt={lessons.maps.alt}
          at="I4:L7"
          figure={lessons.maps.figure}
          credit={lessons.maps.credit}
          group={1}
          captionLines={3}
          sizes="(max-width: 1024px) 92vw, 26vw"
        />
      </div>
    </SheetGrid>
  );
}

export default function Act1({ id, title }: { id: string; title: string }) {
  const { stops, ocean, strait, people, sheets } = act1;
  const titleBlock = { act: title, sheet: sheets.island };

  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      {/* The stage has the screen to itself first: the sheet comes in from below once it has settled. */}
      <div className="lg:motion-safe:pt-[120svh]">
        <SheetGrid id="ocean" title={titleBlock} hold>
          <StageWindow
            at="A1:L6"
            figure={ocean.figure}
            frame={<StaticFrame bare focus={stops[0].center} scale={stops[0].scale} ratio={MAP_RATIO} alt={home.mapAlt} />}
          />
          <SheetBlock at="A7:F8">
            <Lines group={0}>{ocean.text}</Lines>
          </SheetBlock>
        </SheetGrid>
      </div>

      {/* A leg: this sheet's arrival moves the camera. The gap keeps the move in view. */}
      <div data-act-leg className="lg:motion-safe:mt-[60svh]">
        <div data-act-card>
          <SheetGrid id="strait-of-malacca" title={titleBlock} titleAt="C8:D8" hold>
            <SheetBlock at="A1:D3" className="lg:pr-1">
              <h3 data-sheet-step="text" data-sheet-group={0} className={`${headingClass} mb-2`}>
                {strait.title}
              </h3>
              <Lines group={0}>{strait.text}</Lines>
            </SheetBlock>
            <Drawing
              image={images[strait.image.name]}
              alt={strait.image.alt}
              at="A4:D7"
              figure={strait.image.figure}
              credit={strait.image.credit}
              sizes="(max-width: 1024px) 92vw, 30vw"
            />
            <StageWindow
              at="E1:L8"
              figure={strait.windowFigure}
              frame={<StaticFrame bare focus={stops[1].center} scale={stops[1].scale} ratio={MAP_RATIO} alt={strait.frameAlt} />}
            />
          </SheetGrid>
        </div>
      </div>

      <div data-act-leg className="lg:motion-safe:mt-[60svh]">
        <div data-act-card>
          <SheetGrid id="the-people" title={titleBlock} hold>
            <StageWindow at="A1:F8" figure={people.windowFigure} frame={<StaticFrame bare focus={stops[2].focus} scale={stops[2].scale} ratio={0.9} alt={people.frameAlt} />} />
            <SheetBlock at="G1:L3" className="lg:pl-4">
              <h3 data-sheet-step="text" data-sheet-group={0} className={headingClass}>
                {people.title}
              </h3>
              <p data-sheet-step="text" data-sheet-group={0} className={`${bodyClass} mb-2 italic`}>
                {people.subtitle}
              </p>
              <Lines group={0}>{people.text}</Lines>
            </SheetBlock>
            <div className="contents [&>.sheet-block]:lg:pl-4">
              <DrawingRow at="G4:L7" heading={people.dwellingTitle} drawings={people.huts.map(asDrawing)} sizes="(max-width: 1024px) 60vw, 30vw" />
            </div>
          </SheetGrid>
        </div>
      </div>

      <ProposalSheets act={title} />
      <StakeSheet act={title} />
      <LessonsSheet act={title} />
    </section>
  );
}
