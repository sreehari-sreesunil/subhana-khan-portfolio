import Image from "next/image";
import type { CSSProperties } from "react";
import { FigureCaption } from "@/components/sheet/Drawing";
import SheetBlock from "@/components/sheet/SheetBlock";
import SheetGrid from "@/components/sheet/SheetGrid";
import { Lines, Name, smallClass } from "@/components/sheet/SheetText";
import { act3, act4, images } from "@/content/ephemeral-ground";
import SnapStrip from "./SnapStrip";

const { strategies, section, sheets } = act4;

// Pairs 1 to 8 in turn, then the section, then its labels.
const SECTION = strategies.length;
const LABELS = SECTION + 1;

const place = { left: "-translate-x-full pr-1.5 text-right", right: "pl-1.5", centre: "-translate-x-1/2 text-center" };

function Strategy({ strategy, group }: { strategy: (typeof strategies)[number]; group: number }) {
  const { src, width, height } = images[strategy.name];
  const credit = "credit" in strategy ? strategy.credit : undefined;
  return (
    <article className="sheet-strategy">
      <div className="sheet-strategy-sketch">
        <div data-sheet-step="drawing" data-sheet-group={group} className="h-full">
          {/* Never above her real size: these are small sketches, so they stay crisp and honest. */}
          <Image
            src={src}
            alt={strategy.alt}
            width={width}
            height={height}
            sizes={`${width}px`}
            className="h-full w-auto max-w-full object-contain object-left"
            style={{ maxHeight: height }}
          />
        </div>
      </div>
      <Name group={group}>{strategy.title}</Name>
      <Lines group={group} className={smallClass}>
        {strategy.text}
      </Lines>
      <FigureCaption figure={strategy.figure} credit={credit} group={group} />
    </article>
  );
}

function SectionStrip() {
  const { src, width, height } = images[section.image.name];
  const ratio = width / height;
  return (
    <SheetBlock at="A7:L8">
      <SnapStrip label={section.stripLabel} hint={act3.scrollHint} fitsDesktop flush>
        <figure className="sheet-section shrink-0 md:w-full md:shrink" style={{ "--sheet-ratio": ratio, maxWidth: width } as CSSProperties}>
          {/* 240px is her section's real height: phones scroll it at full size, never above. */}
          <div className="relative h-60 md:h-auto md:w-full" style={{ aspectRatio: ratio }}>
            {section.labels.map(({ x, lines }) => (
              <span key={lines[0] + x} data-snap className="absolute inset-y-0 w-px snap-center" style={{ left: `${x}%` }} />
            ))}
            <div data-sheet-step="drawing" data-sheet-group={SECTION} className="absolute inset-0">
              <Image src={src} alt={section.image.alt} fill sizes="(max-width: 768px) 300vw, 95vw" />
            </div>
            {section.labels.map(({ lines, x, y, side }) => (
              <p
                key={lines[0] + x}
                data-sheet-step="text"
                data-sheet-group={LABELS}
                className={`sheet-section-label absolute font-body font-semibold text-ink-green ${place[side]}`}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {lines.map((line) => (
                  <span key={line} className="block whitespace-nowrap">
                    {line}
                  </span>
                ))}
              </p>
            ))}
            <div className="sheet-section-caption">
              <FigureCaption figure={section.image.figure} group={SECTION} />
            </div>
          </div>
        </figure>
      </SnapStrip>
    </SheetBlock>
  );
}

/** Her p.16: the eight strategies as a series of equals, with the long site section as the sheet's base. */
export default function StrategiesSheet({ title }: { title: string }) {
  return (
    <SheetGrid id="site-strategies" title={{ act: title, sheet: sheets.strategies }} titleAt="K7:L7" slow hold>
      <SheetBlock at="A1:L6">
        <div className="sheet-strategies">
          {strategies.map((strategy, group) => (
            <Strategy key={strategy.name} strategy={strategy} group={group} />
          ))}
        </div>
      </SheetBlock>
      <SectionStrip />
    </SheetGrid>
  );
}
