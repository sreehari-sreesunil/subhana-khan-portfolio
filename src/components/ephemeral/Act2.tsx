"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Grain from "@/components/Grain";
import RevealImage from "@/components/RevealImage";
import { act1, act2, images, type EgImage, type TextPart } from "@/content/ephemeral-ground";
import LineReveal from "./LineReveal";
import SlownessMotif, { WALK_FROM } from "./SlownessMotif";
import SnapStrip from "./SnapStrip";
import StaggerIn from "./StaggerIn";
import Strategies from "./Strategies";
import { Card, StaticFrame } from "./StoryFrames";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Slowness: everything here runs at 1.2–1.6s, one thing at a time, and the camera stays parked.
const SLOW = { duration: 1.4, stagger: 0.3 };

const creditClass = "mt-2 font-ui text-[11px] leading-snug text-ink-green/70";
const sectionTitle = "font-heading text-[clamp(1.5rem,3vw,2.75rem)] font-semibold text-ink-green";
const bodyText = "font-body text-[clamp(1rem,1.25vw,1.2rem)] leading-relaxed text-ink-green";

const withBold = (parts: TextPart[]) => parts.map((part) => (part.bold ? <strong key={part.text}>{part.text}</strong> : part.text));

// The tallest arch fills 80% of the screen; the others keep the same scale.
const ARCH_TALLEST = 1265;

type SlowArticleProps = { image: EgImage; name: string; maxHeight?: string; parts?: TextPart[]; text?: string };

/** One image and one thought to a screen. */
function SlowArticle({ image, name, maxHeight = "80svh", parts, text }: SlowArticleProps) {
  const { src, width, height } = images[image.name];
  return (
    <article className="grid items-center gap-8 py-10 md:grid-cols-[auto_minmax(0,34rem)] md:justify-center md:gap-16 md:motion-safe:min-h-[190svh] md:motion-safe:py-0">
      <figure>
        <RevealImage
          src={src}
          alt={image.alt}
          width={width}
          height={height}
          sizes="(max-width: 768px) 90vw, 50vw"
          duration={1.4}
          start="top 65%"
          style={{ maxHeight }}
          wrapperClassName="mx-auto w-fit"
          className="block h-auto w-auto max-w-full md:max-w-[50vw]"
        />
        {image.credit && <figcaption className={`${creditClass} text-center`}>{image.credit}</figcaption>}
      </figure>
      <div>
        <h4 className="font-heading text-[clamp(1.35rem,2.2vw,2.1rem)] font-semibold text-ink-green">{name}</h4>
        <LineReveal className={`${bodyText} mt-4`} {...SLOW}>
          {parts ? withBold(parts) : text}
        </LineReveal>
      </div>
    </article>
  );
}

function CaseStrip({ strip }: { strip: (typeof act2.caseStudies.strips)[number] }) {
  const { src, width, height } = images[strip.image.name];
  return (
    <figure className="shrink-0">
      <div className="relative h-[56svh] min-h-96 md:h-[62svh]" style={{ aspectRatio: strip.ratio }}>
        {[0, ...strip.captions.map((caption) => caption.left)].map((left) => (
          <span key={left} data-snap className="absolute inset-y-0 w-px snap-start" style={{ left: `${left}%` }} />
        ))}
        <RevealImage
          src={src}
          alt={strip.image.alt}
          width={width}
          height={height}
          sizes="(max-width: 768px) 320vw, 110vw"
          duration={1.4}
          start="top 85%"
          wrapperClassName="absolute inset-x-0 bottom-0"
          className="block h-auto w-full"
        />
        <StaggerIn className="absolute inset-0" step={0.3} duration={1.4}>
          {strip.captions.map((caption) => (
            <div key={caption.parts[0].text}>
              {caption.line && (
                <span
                  aria-hidden="true"
                  className="absolute w-px bg-ink-green/70"
                  style={{ left: `${caption.line.left}%`, top: `${caption.line.top}%`, height: `${caption.line.height}%` }}
                />
              )}
              <p
                data-stagger
                className="absolute font-body text-[clamp(0.8125rem,1.05vw,1rem)] leading-snug text-ink-green"
                style={{ left: `${caption.left}%`, top: `${caption.top}%`, width: `${caption.width}%` }}
              >
                {withBold(caption.parts)}
              </p>
            </div>
          ))}
        </StaggerIn>
      </div>
      {strip.image.credit && <figcaption className={creditClass}>{strip.image.credit}</figcaption>}
    </figure>
  );
}

export default function Act2({ id, label }: { id: string; label: string }) {
  const rootRef = useRef<HTMLElement>(null);

  // Phones have no stage, so the walker crosses in the page instead.
  useGSAP(
    () => {
      const flow = rootRef.current?.querySelector<HTMLElement>("[data-motif-flow]");
      const walker = flow?.querySelector<HTMLElement>("[data-walker]");
      if (!flow || !walker) return;
      const mm = gsap.matchMedia();
      mm.add("(max-width: 767.98px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          walker,
          { xPercent: WALK_FROM },
          { xPercent: 0, ease: "none", scrollTrigger: { trigger: flow, start: "top bottom", end: "bottom 40%", scrub: 1 } },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id={id} aria-labelledby={`${id}-title`} className="relative">
      <div id="slowness" className="relative px-4 md:motion-safe:pb-[100svh]">
        <div className="flex flex-col justify-center pt-16 pb-8 text-center md:motion-safe:h-svh md:motion-safe:pt-0">
          <p className="font-ui text-xs tracking-[0.18em] text-accent-terracotta md:text-sm">{label}</p>
          <h2
            id={`${id}-title`}
            tabIndex={-1}
            className="mt-4 font-heading text-[clamp(2.1rem,6vw,5.5rem)] leading-[1.05] font-semibold tracking-tight text-ink-green"
          >
            {act2.question}
          </h2>
        </div>
        <LineReveal className={`mx-auto max-w-[44rem] ${bodyText}`} {...SLOW}>
          {act2.definition}
        </LineReveal>
        <div data-motif-flow className="relative mx-auto mt-14 mb-10 h-44 max-w-2xl overflow-x-clip md:motion-safe:hidden">
          <SlownessMotif />
        </div>
        <Grain surface="colour" />
      </div>

      <div id="philosophers" className="relative px-4 pt-10 md:px-10 md:motion-safe:pt-0">
        <h3 className={sectionTitle}>{act2.philosophersTitle}</h3>
        {act2.philosophers.map((person) => (
          <SlowArticle
            key={person.name}
            image={person.image}
            name={person.name}
            parts={person.caption}
            maxHeight={`${(images[person.image.name].height / ARCH_TALLEST) * 80}svh`}
          />
        ))}
        <Grain surface="colour" />
      </div>

      <div id="neuroscience" className="relative px-4 py-10 md:px-10 md:motion-safe:py-[32svh]">
        <h3 className={sectionTitle}>{act2.neuroscienceTitle}</h3>
        <div className="mt-8 md:motion-safe:mt-16">
          <StaggerIn step={0.6} duration={1.4} oneByOne>
            <ul className="mx-auto grid max-w-6xl gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {act2.tiles.map((tile) => {
                const image = images[tile.image.name];
                return (
                  <li key={tile.title} data-stagger className="flex flex-col">
                    <figure className="mt-auto">
                      <Image
                        src={image.src}
                        alt={tile.image.alt}
                        width={image.width}
                        height={image.height}
                        sizes="(max-width: 768px) 90vw, 30vw"
                        className="mx-auto block h-auto w-60 max-w-full"
                      />
                      <figcaption className={`${creditClass} text-center`}>{tile.image.credit}</figcaption>
                    </figure>
                    <h4 className="mt-4 font-heading text-[clamp(1.1rem,1.5vw,1.4rem)] font-semibold text-ink-green">{tile.title}</h4>
                    <p className="mt-2 font-body leading-relaxed text-ink-green">{tile.text}</p>
                  </li>
                );
              })}
            </ul>
          </StaggerIn>
        </div>
        <Grain surface="colour" />
      </div>

      <div id="case-studies" className="relative py-10 md:motion-safe:py-[24svh]">
        <h3 className={`${sectionTitle} px-4 md:px-10`}>{act2.caseStudies.title}</h3>
        <div className="mt-8">
          <SnapStrip label={act2.caseStudies.label} hint={act2.caseStudies.hint}>
            {act2.caseStudies.strips.map((strip) => (
              <CaseStrip key={strip.image.name} strip={strip} />
            ))}
          </SnapStrip>
        </div>
        <Grain surface="colour" />
      </div>

      <div id="application" className="relative px-4 pt-10 md:px-10 md:motion-safe:pt-0 md:motion-safe:pb-[30svh]">
        <h3 className={sectionTitle}>{act2.applicationTitle}</h3>
        {act2.application.map((project) => (
          <SlowArticle key={project.name} image={project.image} name={project.name} text={project.text} />
        ))}
        <Grain surface="colour" />
      </div>

      {/* The paper has lifted by now: these are cards over the island again, as in Act 1. */}
      <div id="back-to-the-island" className="relative">
        <StaticFrame focus={act1.stops[2].focus} scale={act1.stops[2].scale} ratio={0.9} alt={act1.people.frameAlt} />
        <Card id="a-different-logic" seed={111} wide gap="move">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <figure>
              <RevealImage
                src={images[act2.island.collage.name].src}
                alt={act2.island.collage.alt}
                width={images[act2.island.collage.name].width}
                height={images[act2.island.collage.name].height}
                sizes="(max-width: 768px) 80vw, 30vw"
                duration={1.4}
                className="block h-auto w-full"
              />
            </figure>
            <div className="space-y-5">
              <LineReveal className={bodyText} {...SLOW}>
                {act2.island.key}
              </LineReveal>
              <LineReveal className={bodyText} {...SLOW}>
                {act2.island.closing}
              </LineReveal>
            </div>
          </div>
        </Card>
        <Card id="terrain-diagrams" seed={112} wide gap="hold">
          <StaggerIn className="space-y-8" step={0.4} duration={1.4} oneByOne>
            {act2.island.diagrams.map((diagram) => {
              const image = images[diagram.image.name];
              return (
                <div key={diagram.title} data-stagger className="grid items-center gap-4 md:grid-cols-[3fr_2fr] md:gap-8">
                  <Image
                    src={image.src}
                    alt={diagram.image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 768px) 80vw, 40vw"
                    className="block h-auto w-full"
                  />
                  <div>
                    <h4 className="font-heading text-[clamp(1.1rem,1.5vw,1.4rem)] font-semibold text-ink-green">{diagram.title}</h4>
                    {diagram.text.map((line) => (
                      <p key={line} className="mt-2 font-body text-[clamp(0.9rem,1vw,1rem)] leading-relaxed text-ink-green">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </StaggerIn>
        </Card>
      </div>

      <Strategies />
    </section>
  );
}
