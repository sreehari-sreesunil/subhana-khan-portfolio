import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import Grain from "@/components/Grain";
import RevealImage from "@/components/RevealImage";
import Drawing, { FigureCaption } from "@/components/sheet/Drawing";
import KeyPlan from "@/components/sheet/KeyPlan";
import SheetBlock from "@/components/sheet/SheetBlock";
import SheetGrid from "@/components/sheet/SheetGrid";
import { headingClass, Lines } from "@/components/sheet/SheetText";
import { act3, images, type EgFigure, type EgImage } from "@/content/ephemeral-ground";
import SitePhotos from "./SitePhotos";
import SnapStrip from "./SnapStrip";
import { SiteOutline } from "./SiteBoundary";
import { Card, Credit, StaticFrame } from "./StoryFrames";

const { landAnalysis, settlements, site, plan, context, sheets } = act3;

const sectionTitle = "font-heading text-[clamp(1.5rem,3vw,2.75rem)] font-semibold text-ink-green";
const body = "font-body text-[clamp(0.95rem,1.05vw,1.05rem)] leading-relaxed text-ink-green";
const smallList = "font-ui text-sm leading-relaxed text-ink-green";
const sheetList = "font-ui text-[length:var(--sheet-small)] leading-snug text-ink-green";

function WideImage({ image, label, photos }: { image: EgImage; label: string; photos: number }) {
  const { src, width, height } = images[image.name];
  return (
    <SnapStrip label={label} hint={act3.scrollHint} fitsDesktop>
      <figure className="shrink-0 md:w-full md:shrink">
        <div className="relative h-[44svh] min-h-72 md:h-auto md:min-h-0 md:w-full" style={{ aspectRatio: width / height }}>
          {Array.from({ length: photos }, (_, i) => (
            <span key={i} data-snap className="absolute inset-y-0 w-px snap-start" style={{ left: `${(i / photos) * 100}%` }} />
          ))}
          <RevealImage
            src={src}
            alt={image.alt}
            width={width}
            height={height}
            sizes="(max-width: 768px) 300vw, 100vw"
            wrapperClassName="absolute inset-0"
            className="block h-full w-full"
          />
        </div>
        {image.credit && <Credit>{image.credit}</Credit>}
      </figure>
    </SnapStrip>
  );
}

type SheetStripProps = {
  image: EgFigure;
  at: string;
  label: string;
  /** Where a phone's scroll rests, as % of the strip. */
  stops: number[];
  children?: ReactNode;
};

/** A drawing too wide for a phone: on the sheet it fits its cells, on a phone it scrolls sideways. */
function SheetStrip({ image, at, label, stops, children }: SheetStripProps) {
  const { src, width, height } = images[image.name];
  const ratio = width / height;
  const style = { "--sheet-ratio": ratio, "--sheet-caption": image.credit ? "2.25rem" : "1.25rem" } as CSSProperties;
  return (
    <SheetBlock at={at}>
      <SnapStrip label={label} hint={act3.scrollHint} fitsDesktop flush>
        <figure className="sheet-strip-fit shrink-0 md:w-full md:shrink" style={style}>
          <div className="relative h-[44svh] min-h-72 md:h-auto md:min-h-0 md:w-full" style={{ aspectRatio: ratio }}>
            {stops.map((left) => (
              <span key={left} data-snap className="absolute inset-y-0 w-px snap-start" style={{ left: `${left}%` }} />
            ))}
            <div data-sheet-step="drawing" data-sheet-group={0} className="absolute inset-0">
              <Image src={src} alt={image.alt} fill sizes="(max-width: 768px) 300vw, 95vw" />
            </div>
            {children}
          </div>
          <FigureCaption figure={image.figure} credit={image.credit} />
        </figure>
      </SnapStrip>
    </SheetBlock>
  );
}

function ContextMap() {
  const { image, key } = context.map;
  const { src, width, height } = images[image.name];
  return (
    <div className="mt-6 grid items-end gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] md:gap-10">
      <figure>
        <RevealImage src={src} alt={image.alt} width={width} height={height} sizes="(max-width: 768px) 92vw, 70vw" className="block h-auto w-full" />
        <Credit>{image.credit}</Credit>
      </figure>
      <ol className={`${smallList} list-inside list-decimal`}>
        {key.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ol>
    </div>
  );
}

function LandAnalysisSheet({ id, title }: { id: string; title: string }) {
  const cells = ["A1:D6", "E1:H6", "I1:L6"];
  return (
    <SheetGrid id="land-analysis" title={{ act: title, sheet: sheets.maps }} hold>
      {landAnalysis.maps.map((map, group) => (
        <Drawing
          key={map.name}
          image={images[map.name]}
          alt={map.alt}
          at={cells[group]}
          figure={map.figure}
          credit={map.credit}
          group={group}
          captionLines={3}
          sizes="(max-width: 1024px) 92vw, 32vw"
        />
      ))}
      <SheetBlock at="A7:C8">
        <h2 id={`${id}-title`} tabIndex={-1} data-sheet-step="text" data-sheet-group={landAnalysis.maps.length} className={headingClass}>
          {title}
        </h2>
      </SheetBlock>
      <SheetBlock at="D7:J8">
        <Lines group={landAnalysis.maps.length}>{landAnalysis.text}</Lines>
      </SheetBlock>
    </SheetGrid>
  );
}

function SettlementsSheet({ title }: { title: string }) {
  return (
    <SheetGrid id="settlements" title={{ act: title, sheet: sheets.maps }} hold>
      <SheetStrip image={settlements.image} at="A1:L5" label={settlements.label} stops={settlements.names.map(({ left }) => left)}>
        {settlements.names.map(({ name, left, top }) => (
          <span
            key={name}
            data-sheet-step="callout"
            data-sheet-group={0}
            className="absolute font-body text-[clamp(0.9rem,1.5vw,1.5rem)] leading-none whitespace-nowrap text-ink-green"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            {name}
          </span>
        ))}
      </SheetStrip>
      <SheetBlock at="A6:F7">
        <Lines group={0}>{settlements.text}</Lines>
      </SheetBlock>
    </SheetGrid>
  );
}

function SitePlanSheet({ title }: { title: string }) {
  const { keyPlan } = context;
  return (
    <SheetGrid id="site-plan" title={{ act: title, sheet: sheets.plan }} hold>
      <SheetStrip image={plan.image} at="A1:J6" label={plan.title} stops={[0, 100 / 3, 200 / 3]} />
      <SheetBlock at="K1:L1" className="lg:pl-3">
        <h3 data-sheet-step="text" data-sheet-group={0} className={headingClass}>
          {plan.title}
        </h3>
      </SheetBlock>
      <div className="contents [&>.sheet-block]:lg:pl-3">
        <KeyPlan
          image={images[keyPlan.image.name]}
          alt={keyPlan.image.alt}
          at="K2:L3"
          figure={plan.keyPlanFigure}
          credit={keyPlan.image.credit}
          area={keyPlan.area}
          group={1}
          sizes="(max-width: 1024px) 92vw, 16vw"
        />
      </div>
      <SheetBlock at="K4:L7" className="lg:pl-3">
        <ul data-sheet-step="text" data-sheet-group={1} className={sheetList}>
          {plan.data.map((line) => (
            <li key={line} className="mb-1">
              {line}
            </li>
          ))}
        </ul>
        <ol data-sheet-step="text" data-sheet-group={1} className={`${sheetList} mt-2 list-inside list-decimal`}>
          {plan.legend.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
        <ul data-sheet-step="text" data-sheet-group={1} className={`${sheetList} mt-2`}>
          {plan.wind.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </SheetBlock>
      <SheetBlock at="A7:E8">
        <Lines group={1}>{plan.layout}</Lines>
      </SheetBlock>
      <SheetBlock at="F7:J8" className="lg:pl-3">
        <Lines group={1}>{plan.transect}</Lines>
      </SheetBlock>
    </SheetGrid>
  );
}

export default function Act3({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <LandAnalysisSheet id={id} title={title} />
      <SettlementsSheet title={title} />

      {/* A leg: this card's arrival takes the camera down to the site, and draws its outline. */}
      <div id="the-site" data-act-leg className="relative md:motion-safe:pb-[80svh]">
        <StaticFrame focus={site.stop.center} scale={50} ratio={1.5} alt={site.frameAlt}>
          <SiteOutline />
        </StaticFrame>
        <Card id="where-exactly" seed={123} gap="move">
          <p className={body}>{site.text}</p>
        </Card>
      </div>

      <SitePlanSheet title={title} />

      <div id="site-context" className="paper-fibre relative space-y-14 bg-paper pb-16 md:motion-safe:space-y-[14svh] md:motion-safe:pb-[20svh]">
        <SitePhotos act={title} />
        <div>
          <h3 className={`${sectionTitle} px-4 md:px-10`}>{context.section.title}</h3>
          <div className="mt-6">
            <WideImage image={context.section.image} label={context.section.title} photos={4} />
          </div>
        </div>
        <div className="px-4 md:px-10">
          <h3 className={sectionTitle}>{context.map.title}</h3>
          <ContextMap />
        </div>
        <Grain surface="colour" />
      </div>
    </section>
  );
}
