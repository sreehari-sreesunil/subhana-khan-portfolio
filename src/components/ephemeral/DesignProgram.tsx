"use client";

import { useState } from "react";
import { FigureCaption } from "@/components/sheet/Drawing";
import SheetBlock from "@/components/sheet/SheetBlock";
import SheetGrid from "@/components/sheet/SheetGrid";
import { headingClass, Lines, smallClass } from "@/components/sheet/SheetText";
import { act4 } from "@/content/ephemeral-ground";
import {
  programArrows,
  programBubbles,
  programColours,
  programCourtyard,
  programOrder,
  programView,
  type ProgramBubble,
  type ProgramGroup,
  type ProgramLayout,
} from "@/content/ephemeral-program";

const { program, sheets } = act4;

// Her labels' dark blue, sampled from p.13.
const LABEL = "#0E3A57";
const DIM = 0.2;
// Each colour group reveals in turn, then the arrows draw, then their heads and the words.
const ARROWS = programOrder.length;
const LAST = ARROWS + 1;

const dimmable = "transition-opacity duration-300 ease-out";
const type = { wide: { size: 19, line: 23, small: 14 }, tall: { size: 13, line: 15, small: 13 } };
const ink = { wide: 1.1, tall: 0.8 };
const RING = "#22262A";

const neighbours = (id: string) => programArrows.flatMap(({ from, to }) => (from === id ? [to] : to === id ? [from] : []));

const nameOf = (id: string) => programBubbles.find((bubble) => bubble.id === id)?.name;

function label(bubble: ProgramBubble) {
  const names = [...new Set(neighbours(bubble.id))].map(nameOf);
  return names.length ? `${bubble.name}, connects to ${names.join(", ")}` : bubble.name;
}

/** Her wash of colour: a circle gone slightly soft at the edge. Seeded, so server and browser draw the same shape. */
function wash(x: number, y: number, r: number, seed: number) {
  const count = 10;
  const points = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const radius = r * (1 + 0.025 * Math.sin(seed * 7.3 + i * 2.4));
    return [x + Math.cos(angle) * radius, y + Math.sin(angle) * radius];
  });
  const middle = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const start = middle(points[count - 1], points[0]);
  const curves = points.map((point, i) => {
    const end = middle(point, points[(i + 1) % count]);
    return `Q${point[0].toFixed(1)} ${point[1].toFixed(1)} ${end[0].toFixed(1)} ${end[1].toFixed(1)}`;
  });
  return `M${start[0].toFixed(1)} ${start[1].toFixed(1)}${curves.join("")}Z`;
}

/** An open arrowhead on the end of a line, turned to the way the line arrives. */
function head(line: string, size: number) {
  const [controlX, controlY, x, y] = (line.match(/-?\d+(\.\d+)?/g) ?? []).map(Number).slice(-4);
  const angle = Math.atan2(y - controlY, x - controlX);
  const barb = (turn: number) => `${(x - Math.cos(angle + turn) * size).toFixed(1)} ${(y - Math.sin(angle + turn) * size).toFixed(1)}`;
  return `M${barb(0.5)}L${x} ${y}L${barb(-0.5)}`;
}

type DiagramProps = { layout: ProgramLayout; active: string | null; setActive: (id: string | null) => void };

function Bubble({ bubble, seed, layout, active, setActive }: DiagramProps & { bubble: ProgramBubble; seed: number }) {
  const { x, y, r, lines } = bubble[layout];
  const { size, line, small } = type[layout];
  const fontSize = r < (layout === "wide" ? 50 : 30) ? small : size;
  const related = active === bubble.id || (active !== null && neighbours(active).includes(bubble.id));
  // Large enough to reach the rings on every side, and spill past them on one, as hers does.
  const spill = Math.max(Math.abs(bubble.wash[0]), Math.abs(bubble.wash[1]));
  const clear = () => setActive(null);

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label(bubble)}
      className={`${dimmable} cursor-default outline-none`}
      style={{ opacity: active === null || related ? 1 : DIM }}
      onMouseEnter={() => setActive(bubble.id)}
      onMouseLeave={clear}
      onFocus={() => setActive(bubble.id)}
      onBlur={clear}
      onClick={() => setActive(bubble.id)}
    >
      <path d={wash(x + bubble.wash[0] * r, y + bubble.wash[1] * r, r * (1 + spill), seed)} fill={programColours[bubble.group]} />
      <circle cx={x} cy={y} r={r} fill="none" stroke={RING} strokeOpacity={0.7} strokeWidth={ink[layout]} />
      <circle cx={x + r * 0.015} cy={y - r * 0.015} r={r * 1.02} fill="none" stroke={RING} strokeOpacity={0.7} strokeWidth={ink[layout]} />
      {active === bubble.id && <circle cx={x} cy={y} r={r * 1.06} fill="none" className="stroke-accent-terracotta" strokeWidth={ink[layout] * 2} />}
      <text textAnchor="middle" fill={LABEL} fontSize={fontSize} fontWeight={600} className="font-body">
        {lines.map((text, i) => (
          <tspan key={text} x={x} y={y + (i - (lines.length - 1) / 2) * line + fontSize * 0.34}>
            {text}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function Diagram({ layout, active, setActive, reveal }: DiagramProps & { reveal: boolean }) {
  const { x, y, width, height } = programView[layout];
  const step = (group: number) => (reveal ? { "data-sheet-step": "callout", "data-sheet-group": group } : {});
  const { size } = type[layout];
  const touches = (from: string, to: string) => active === null || active === from || active === to;
  const courtyard = programCourtyard[layout];

  return (
    <svg role="group" aria-label={program.alt} viewBox={`${x} ${y} ${width} ${height}`} className="block h-full w-full overflow-visible">
      {programOrder.map((group: ProgramGroup, order) => (
        <g key={group} {...step(order)}>
          {programBubbles.map(
            (bubble, seed) =>
              bubble.group === group && <Bubble key={bubble.id} bubble={bubble} seed={seed} layout={layout} active={active} setActive={setActive} />,
          )}
        </g>
      ))}
      <g {...step(ARROWS)} aria-hidden="true" fill="none" className="stroke-ink-green" strokeWidth={ink[layout] * 1.2} strokeLinecap="round" pointerEvents="none">
        {programArrows.map(({ from, to, [layout]: line }) => (
          <path key={`${from}-${to}`} d={line} pathLength={1} strokeDasharray="1" strokeDashoffset="1" className={dimmable} style={{ opacity: touches(from, to) ? 1 : DIM / 2 }} />
        ))}
      </g>
      <g {...step(LAST)} aria-hidden="true" fill="none" className="stroke-ink-green" strokeWidth={ink[layout] * 1.2} strokeLinecap="round" strokeLinejoin="round" pointerEvents="none">
        {programArrows.map(({ from, to, [layout]: line }) => (
          <path key={`${from}-${to}`} d={head(line, layout === "wide" ? 15 : 8)} className={dimmable} style={{ opacity: touches(from, to) ? 1 : DIM / 2 }} />
        ))}
      </g>
      <g {...step(LAST)}>
        <text
          x={courtyard.x}
          y={courtyard.y}
          textAnchor="middle"
          fill={LABEL}
          fontSize={layout === "wide" ? 16 : size}
          fontWeight={600}
          className={`${dimmable} font-body`}
          style={{ opacity: active === null ? 1 : DIM }}
        >
          {programCourtyard.name}
        </text>
      </g>
    </svg>
  );
}

/** Her diagram redrawn: hover, focus or tap a bubble to see what it connects to. */
export default function DesignProgram({ title }: { title: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <SheetGrid id="design-program" title={{ act: title, sheet: sheets.program }} slow hold>
      <SheetBlock at="A1:E2">
        <h3 data-sheet-step="text" data-sheet-group={LAST} className={headingClass}>
          {program.title}
        </h3>
      </SheetBlock>
      <SheetBlock at="F1:J2">
        <Lines group={LAST}>{program.text}</Lines>
      </SheetBlock>
      <SheetBlock at="A3:L7">
        <figure className="flex h-full flex-col">
          {/* Phones get one reveal: the tall diagram fades up and its arrows draw. */}
          <div data-sheet-step="callout" data-sheet-group={LAST} className="lg:hidden">
            <Diagram layout="tall" active={active} setActive={setActive} reveal={false} />
          </div>
          <div className="hidden min-h-0 flex-1 lg:block">
            <Diagram layout="wide" active={active} setActive={setActive} reveal />
          </div>
          <FigureCaption figure={program.figure} group={LAST} />
        </figure>
      </SheetBlock>
      <SheetBlock at="A8:J8" className="lg:pt-2">
        <ul data-sheet-step="text" data-sheet-group={LAST} className="grid grid-cols-2 gap-x-4 gap-y-1 lg:flex lg:flex-wrap lg:gap-x-6">
          {program.legend.map(({ name, group }) => (
            <li key={name} className={`${smallClass} flex items-center gap-2`}>
              <span aria-hidden="true" className="size-3 shrink-0 rounded-full border border-ink-green/30" style={{ background: programColours[group] }} />
              {name}
            </li>
          ))}
        </ul>
      </SheetBlock>
    </SheetGrid>
  );
}
