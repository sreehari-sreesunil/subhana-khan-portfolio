"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Grain from "@/components/Grain";
import RevealImage from "@/components/RevealImage";
import { act2, images } from "@/content/ephemeral-ground";
import LineReveal from "./LineReveal";
import SlownessMotif, { WALK_FROM } from "./SlownessMotif";
import StaggerIn from "./StaggerIn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Slowness: everything here runs at 1.2–1.6s, one thing at a time, and the camera stays parked.
const SLOW = { duration: 1.4, stagger: 0.3 };

const creditClass = "mt-2 font-ui text-[11px] leading-snug text-ink-green/70";
const sectionTitle = "font-heading text-[clamp(1.5rem,3vw,2.75rem)] font-semibold text-ink-green";
const bodyText = "font-body text-[clamp(1rem,1.25vw,1.2rem)] leading-relaxed text-ink-green";

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
        <div className="mx-auto max-w-[44rem] space-y-6">
          <LineReveal className={bodyText} {...SLOW}>
            {act2.definition}
          </LineReveal>
          <LineReveal className={bodyText} {...SLOW}>
            {act2.island}
          </LineReveal>
        </div>
        <div data-motif-flow className="relative mx-auto mt-14 mb-10 h-44 max-w-2xl overflow-x-clip md:motion-safe:hidden">
          <SlownessMotif />
        </div>
        <Grain surface="colour" />
      </div>

      <div id="philosophers" className="relative px-4 pt-10 md:px-10 md:motion-safe:pt-0">
        <h3 className={sectionTitle}>{act2.philosophersTitle}</h3>
        {act2.philosophers.map((person) => {
          const image = images[person.image.name];
          return (
            <article
              key={person.name}
              className="grid items-center gap-8 py-10 md:grid-cols-[auto_minmax(0,34rem)] md:justify-center md:gap-16 md:motion-safe:min-h-[190svh] md:motion-safe:py-0"
            >
              <figure>
                <RevealImage
                  src={image.src}
                  alt={person.image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 768px) 90vw, 40vw"
                  duration={1.4}
                  start="top 65%"
                  wrapperClassName="mx-auto w-fit"
                  className="block h-auto max-h-[80svh] w-auto max-w-full"
                />
                <figcaption className={`${creditClass} text-center`}>{person.image.credit}</figcaption>
              </figure>
              <div>
                <h4 className="font-heading text-[clamp(1.35rem,2.2vw,2.1rem)] font-semibold text-ink-green">{person.name}</h4>
                <LineReveal className={`${bodyText} mt-4`} {...SLOW}>
                  {person.caption.map((part) => (part.bold ? <strong key={part.text}>{part.text}</strong> : part.text))}
                </LineReveal>
              </div>
            </article>
          );
        })}
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
    </section>
  );
}
