"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ephemeralGroundPreview as content } from "@/content/home";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ZOOM = 4;

export default function EphemeralGroundPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const { mapDot } = content;

  // Desktop: the frame is sticky for one screen of scrolling while the map zooms toward
  // Great Nicobar and crossfades into her site plan. Phones: the plan fades up once.
  // Reduced motion: nothing moves (CSS shows the plan and hides the map).
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const map = section.querySelector<HTMLElement>("[data-eg-map]");
      const dot = section.querySelector<HTMLElement>("[data-eg-dot]");
      const plan = section.querySelector<HTMLElement>("[data-eg-plan]");
      if (!map || !dot || !plan) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          // 2D transform keeps the SVG re-rendered sharp at every scale.
          .to(map, { scale: ZOOM, ease: "power1.in", force3D: false, duration: 0.7 }, 0)
          .to(dot, { opacity: 0, duration: 0.15 }, 0.45)
          .to(map, { opacity: 0, duration: 0.4 }, 0.45)
          .fromTo(plan, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4 }, 0.45)
          .to({}, { duration: 0.15 }, 0.85);
      });
      mm.add("(max-width: 767.98px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.from(plan, {
          opacity: 0,
          y: 24,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: plan, start: "top 85%", once: true },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    // overflow-x-clip, not overflow-hidden: hidden would break the sticky frame inside.
    <section
      ref={sectionRef}
      aria-labelledby="eg-heading"
      className="relative overflow-x-clip bg-white md:motion-safe:h-[200vh]"
    >
      <div className="relative px-4 pt-4 pb-20 md:grid md:min-h-svh md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-12 md:px-10 md:py-0 md:motion-safe:sticky md:motion-safe:top-0 md:motion-safe:h-svh">
        <span
          aria-hidden="true"
          className="-ml-[calc(1rem+0.08em)] block font-heading text-[44vw] leading-[0.78] font-bold tracking-tight text-ink-green md:absolute md:top-0 md:left-0 md:m-0 md:-translate-x-[0.07em] md:-translate-y-[0.14em] md:text-[clamp(9rem,34vh,22rem)]"
        >
          {content.numeral}
        </span>

        <div className="relative mt-8 md:mt-0 md:pt-[22vh]">
          <p className="font-ui text-xs tracking-[0.18em] text-accent-terracotta md:text-sm">{content.label}</p>
          <h2
            id="eg-heading"
            className="mt-4 max-w-[15em] font-heading text-[clamp(1.6rem,2.6vw,2.75rem)] leading-[1.08] font-semibold text-ink-green uppercase"
          >
            {content.headline}
          </h2>
          <p className="mt-5 max-w-[34ch] font-body text-[clamp(1rem,1.2vw,1.15rem)] leading-relaxed text-ink-green">
            {content.story}
          </p>
          <Link
            href={content.link.href}
            className="mt-6 inline-block font-ui text-sm tracking-wide text-accent-terracotta underline-offset-4 hover:underline md:text-base"
          >
            {content.link.label} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="relative mt-12 md:mt-0 md:flex md:h-full md:items-center">
          {/* Map: desktop with motion only. It zooms around Great Nicobar, inside its own frame. */}
          <div className="relative hidden w-full overflow-hidden md:motion-safe:block" style={{ aspectRatio: `${content.map.width} / ${content.map.height}` }}>
            <div data-eg-map className="absolute inset-0" style={{ transformOrigin: `${mapDot.x}% ${mapDot.y}%` }}>
              <Image src={content.map.src} alt={content.mapAlt} fill sizes="60vw" className="object-cover" />
            </div>
            <div
              data-eg-dot
              aria-hidden="true"
              className="absolute size-3 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${mapDot.x}%`, top: `${mapDot.y}%` }}
            >
              <span className="map-pulse absolute inset-0 rounded-full border-2 border-white" />
              <span className="absolute inset-0 rounded-full border-2 border-white bg-thesis-teal" />
            </div>
          </div>

          {/* Site plan: wider than its column so her drawing fills it; the empty board bleeds off the right. */}
          <div className="-ml-[8%] w-[130%] md:motion-safe:absolute md:motion-safe:inset-y-0 md:motion-safe:left-[-6%] md:motion-safe:ml-0 md:motion-safe:flex md:motion-safe:items-center">
            <div data-eg-plan className="w-full md:motion-safe:opacity-0">
              <Image
                src={content.sitePlan.src}
                alt={content.sitePlanAlt}
                width={content.sitePlan.width}
                height={content.sitePlan.height}
                sizes="(max-width: 768px) 130vw, 75vw"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
