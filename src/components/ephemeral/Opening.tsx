import { getImageProps } from "next/image";
import Grain from "@/components/Grain";
import { ephemeralGroundPreview as home } from "@/content/home";
import { images, opening } from "@/content/ephemeral-ground";
import { MAP_H, MAP_W, planAtDiveEnd } from "@/lib/ephemeral-geometry";
import LineReveal from "./LineReveal";

const { sitePlan, sitePlanAlt } = home;
const mobilePlan = images["opening/plan-mobile"];

function PlanPicture() {
  const { props: desktop } = getImageProps({
    src: sitePlan.src,
    alt: sitePlanAlt,
    width: sitePlan.width,
    height: sitePlan.height,
    sizes: "75vw",
    loading: "eager",
  });
  const { props: mobile } = getImageProps({
    src: mobilePlan.src,
    alt: "",
    width: mobilePlan.width,
    height: mobilePlan.height,
    sizes: "100vw",
  });

  return (
    <picture>
      <source
        media="(max-width: 767.98px)"
        srcSet={mobile.srcSet}
        sizes={mobile.sizes}
        width={mobile.width}
        height={mobile.height}
      />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
      <img
        {...desktop}
        className="block h-auto w-full max-w-none mix-blend-multiply md:absolute md:top-(--plan-top) md:left-(--plan-left) md:w-(--plan-width)"
      />
    </picture>
  );
}

export default function Opening() {
  return (
    <>
      <section aria-labelledby="eg-title" className="relative overflow-x-clip bg-white md:h-svh">
        <div className="relative px-4 pt-14 pb-8 md:grid md:h-full md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center md:gap-12 md:px-10 md:py-0">
          <div className="relative z-10 md:order-2 md:flex md:h-full md:flex-col md:justify-center">
            <span
              aria-hidden="true"
              className="-ml-[calc(1rem+0.08em)] block font-heading text-[44vw] leading-[0.78] font-bold tracking-tight text-ink-green md:absolute md:top-0 md:left-0 md:m-0 md:-translate-x-[0.07em] md:-translate-y-[0.14em] md:text-[clamp(9rem,34vh,22rem)]"
            >
              {opening.numeral}
            </span>
            <h1
              id="eg-title"
              className="mt-6 font-heading text-[clamp(1.9rem,3.2vw,3.25rem)] leading-[1.05] font-semibold text-ink-green md:mt-[22vh]"
            >
              {opening.title}
            </h1>
            <dl className="mt-5 space-y-1 font-body text-[clamp(0.95rem,1.1vw,1.1rem)] leading-snug text-ink-green">
              {opening.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="inline font-semibold">{fact.label}: </dt>
                  <dd className="inline">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mt-8 -mr-4 md:order-1 md:mt-0 md:mr-0">
            {/* Same box as the home dive's frame, so the plan lands where the dive left it. */}
            <div
              className="relative md:overflow-hidden"
              style={
                {
                  "--plan-left": `${planAtDiveEnd.left}%`,
                  "--plan-top": `${planAtDiveEnd.top}%`,
                  "--plan-width": `${planAtDiveEnd.width}%`,
                  "--frame-ratio": `${MAP_W} / ${MAP_H}`,
                } as React.CSSProperties
              }
            >
              <div className="hidden md:block md:aspect-(--frame-ratio)" />
              <PlanPicture />
            </div>
            {/* The height of the home section's Replay link, which sets where its frame sits. */}
            <div aria-hidden="true" className="mt-4 hidden h-5 md:block" />
          </div>
        </div>
        <Grain surface="white" />
      </section>

      <section aria-labelledby="eg-brief" className="relative bg-white px-4 pt-8 pb-20 md:px-10 md:pt-24 md:pb-32">
        <div className="md:ml-[60%]">
          <h2 id="eg-brief" className="font-heading text-[clamp(1.25rem,1.8vw,1.75rem)] font-semibold text-ink-green">
            {opening.briefHeading}
          </h2>
          <LineReveal className="mt-4 max-w-[46ch] font-body text-[clamp(1rem,1.2vw,1.15rem)] leading-relaxed text-ink-green">
            {opening.brief}
          </LineReveal>
        </div>
        <Grain surface="white" />
      </section>
    </>
  );
}
