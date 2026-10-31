import type { CSSProperties } from "react";
import Grain from "@/components/Grain";
import RevealImage from "@/components/RevealImage";
import { act3, images, type EgImage } from "@/content/ephemeral-ground";
import SnapStrip from "./SnapStrip";
import { SiteOutline } from "./SiteBoundary";
import { Card, Credit, StaticFrame } from "./StoryFrames";

const { landAnalysis, settlements, site, plan, context } = act3;

const sectionTitle = "font-heading text-[clamp(1.5rem,3vw,2.75rem)] font-semibold text-ink-green";
const body = "font-body text-[clamp(0.95rem,1.05vw,1.05rem)] leading-relaxed text-ink-green";
const smallList = "font-ui text-sm leading-relaxed text-ink-green";

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

export default function Act3({ id, title }: { id: string; title: string }) {
  const strip = images[settlements.image.name];

  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <div id="land-analysis" className="relative md:motion-safe:flex md:motion-safe:min-h-[340svh] md:motion-safe:flex-col md:motion-safe:justify-between">
        <h2
          id={`${id}-title`}
          tabIndex={-1}
          className="relative px-4 pt-16 font-heading text-[clamp(1.75rem,3.4vw,3.25rem)] font-semibold text-ink-green md:px-10 md:motion-safe:pt-[34svh]"
        >
          {title}
        </h2>

        {/* The stage shows these on desktop; here they follow one another down the page. */}
        <div className="mt-6 grid gap-6 px-4 md:mx-auto md:max-w-2xl md:motion-safe:hidden">
          {landAnalysis.maps.map((map) => {
            const { src, width, height } = images[map.name];
            return (
              <figure key={map.name}>
                <RevealImage src={src} alt={map.alt} width={width} height={height} sizes="(max-width: 768px) 92vw, 42rem" className="block h-auto w-full" />
                <Credit>{map.credit}</Credit>
              </figure>
            );
          })}
        </div>

        <Card id="land-use" seed={122} slim gap="end">
          <p className={body}>{landAnalysis.text}</p>
        </Card>
      </div>

      <div id="settlements" className="paper-fibre relative mt-8 bg-paper py-12 md:mt-0 md:motion-safe:py-[20svh]">
        <p className={`${body} mx-auto max-w-[44rem] px-4`}>{settlements.text}</p>
        <div className="mt-10">
          <SnapStrip label={settlements.label} hint={act3.scrollHint}>
            <figure className="relative h-[56svh] min-h-96 shrink-0" style={{ aspectRatio: strip.width / strip.height }}>
              <RevealImage
                src={strip.src}
                alt={settlements.image.alt}
                width={strip.width}
                height={strip.height}
                sizes="(max-width: 768px) 450vw, 130vw"
                duration={1.2}
                start="top 85%"
                wrapperClassName="absolute inset-0"
                className="block h-full w-full"
              />
              {settlements.names.map(({ name, left, top }) => (
                <div key={name}>
                  <span data-snap className="absolute inset-y-0 w-px snap-start" style={{ left: `${left}%` }} />
                  <span
                    className="absolute font-body text-[clamp(1rem,3.1svh,1.75rem)] leading-none whitespace-nowrap text-ink-green"
                    style={{ left: `${left}%`, top: `${top}%` } satisfies CSSProperties}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </figure>
          </SnapStrip>
        </div>
        <Grain surface="colour" />
      </div>

      {/* A leg: this card's arrival takes the camera down to the site, and draws its outline. */}
      <div id="the-site" data-act-leg className="relative md:motion-safe:pb-[80svh]">
        <StaticFrame focus={site.stop.center} scale={50} ratio={1.5} alt={site.frameAlt}>
          <SiteOutline />
        </StaticFrame>
        <Card id="where-exactly" seed={123} gap="move">
          <p className={body}>{site.text}</p>
        </Card>
      </div>

      <div id="site-plan" className="paper-fibre relative bg-paper py-12 md:motion-safe:py-[18svh]">
        <h3 className={`${sectionTitle} px-4 md:px-10`}>{plan.title}</h3>
        <div className="mt-6">
          <WideImage image={plan.image} label={plan.title} photos={3} />
        </div>
        <div className="mt-10 grid gap-8 px-4 md:grid-cols-2 md:gap-x-16 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)]">
          <ul className={smallList}>
            {plan.data.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className={smallList}>
            <ol className="list-inside list-decimal">
              {plan.legend.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
            <ul className="mt-3">
              {plan.wind.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <p className={body}>{plan.layout}</p>
            <p className={body}>{plan.transect}</p>
          </div>
        </div>
        <Grain surface="colour" />
      </div>

      <div id="site-context" className="paper-fibre relative space-y-14 bg-paper pb-16 md:motion-safe:space-y-[14svh] md:motion-safe:pb-[20svh]">
        <div>
          <h3 className={`${sectionTitle} px-4 md:px-10`}>{context.infrastructure.title}</h3>
          <div className="mt-6">
            <WideImage image={context.infrastructure.image} label={context.infrastructure.title} photos={6} />
          </div>
        </div>
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
        <div>
          <h3 className={`${sectionTitle} px-4 md:px-10`}>{context.photos.title}</h3>
          <div className="mt-6">
            <WideImage image={context.photos.image} label={context.photos.title} photos={6} />
          </div>
        </div>
        <Grain surface="colour" />
      </div>
    </section>
  );
}
