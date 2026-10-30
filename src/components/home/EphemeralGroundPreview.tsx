"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ephemeralGroundPreview as content } from "@/content/home";
import Grain from "@/components/Grain";
import { getLenis } from "@/components/SmoothScroll";
import TransitionLink from "@/components/TransitionLink";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MAP_W = content.map.width;
const MAP_H = content.map.height;
const DOT_PX = 3;

const { site, sitePlan } = content;
const imageW = site.widthUnits / (site.drawing.right - site.drawing.left);
const imageH = (imageW * sitePlan.height) / sitePlan.width;
const imageX = site.target.x - ((site.drawing.left + site.drawing.right) / 2) * imageW;
const imageY = site.target.y - ((site.drawing.top + site.drawing.bottom) / 2) * imageH;
const outlinePoints = site.outline
  .map(([x, y]) => `${(imageX + x * imageW).toFixed(2)},${(imageY + y * imageH).toFixed(2)}`)
  .join(" ");

// The drawing ends at 86% of the visual's width, which sets how deep the camera goes.
const DEPTH = (0.86 * MAP_W) / site.widthUnits;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export default function EphemeralGroundPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const { mapDot, mapRing } = content;

  // Desktop: the section settles to the top once, then the dive plays once on a clock.
  // Phones: the plan fades up. Reduced motion: CSS shows the final state.
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const frame = section.querySelector<HTMLElement>("[data-eg-frame]");
      const world = section.querySelector<HTMLElement>("[data-eg-world]");
      const map = section.querySelector<HTMLElement>("[data-eg-map]");
      const marks = gsap.utils.toArray<Element>("[data-eg-mark]", section);
      const plan = section.querySelector<HTMLElement>("[data-eg-plan]");
      const boundary = section.querySelector<SVGElement>("[data-eg-boundary]");
      const reveal = section.querySelector<SVGElement>("[data-eg-reveal]");
      const text = gsap.utils.toArray<HTMLElement>("[data-eg-text]", section);
      const replay = section.querySelector<HTMLElement>("[data-eg-replay]");
      const planStatic = section.querySelector<HTMLElement>("[data-eg-plan-static]");
      if (!frame || !world || !map || !plan || !boundary || !reveal || !replay || !planStatic) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const camera = { zoom: 0 };
        const placeCamera = () => {
          // Logarithmic: equal steps of zoom multiply the scale by an equal amount.
          const scale = DEPTH ** camera.zoom;
          const screenX = gsap.utils.interpolate(site.target.x, MAP_W / 2, camera.zoom);
          const screenY = gsap.utils.interpolate(site.target.y, MAP_H / 2, camera.zoom);
          gsap.set(world, {
            xPercent: ((screenX - site.target.x * scale) / MAP_W) * 100,
            yPercent: ((screenY - site.target.y * scale) / MAP_H) * 100,
            scale,
            // 2D transform keeps the SVG re-rendered sharp at every scale.
            force3D: false,
          });
          // The boundary's dots stay the same size on screen as the camera closes in.
          boundary.setAttribute("stroke-width", String((DOT_PX * MAP_W) / (frame.clientWidth * scale)));
        };
        gsap.set(world, { transformOrigin: "0 0" });
        placeCamera();

        const dive = gsap
          .timeline({ paused: true, onUpdate: placeCamera })
          .to(camera, { zoom: 1, duration: 4.4, ease: "sine.inOut" }, 0.8)
          .to(marks, { opacity: 0, duration: 0.8, ease: "power2.out" }, 1)
          .set(boundary, { opacity: 1 }, 2.2)
          .to(reveal, { attr: { "stroke-dashoffset": 0 }, duration: 1, ease: "sine.inOut" }, 2.2)
          .to(plan, { opacity: 1, duration: 1.2, ease: "sine.inOut" }, 3.2)
          .to(map, { opacity: 0, duration: 1.2, ease: "sine.inOut" }, 3.2)
          .to(boundary, { opacity: 0, duration: 0.6, ease: "power2.out" }, 4.6)
          .to(text, { opacity: 1, duration: 0.9, ease: "power2.out", stagger: 0.2 }, 0.5)
          .to(replay, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 6.2);

        let played = false;
        const play = () => {
          if (played) return;
          played = true;
          dive.play();
        };

        const landing = ScrollTrigger.create({
          trigger: section,
          start: "top 25%",
          end: "top top",
          onEnter: () => {
            // Also fires on a page restored below the section; that must not pull the reader back.
            if (played || section.getBoundingClientRect().top <= 0) return;
            getLenis()?.scrollTo(section, { duration: 0.8, easing: easeOutCubic });
          },
        });
        const landed = ScrollTrigger.create({ trigger: section, start: "top 2px", once: true, onEnter: play });

        const onReplay = () => {
          dive.restart();
          placeCamera();
        };
        replay.addEventListener("click", onReplay);

        return () => {
          replay.removeEventListener("click", onReplay);
          landing.kill();
          landed.kill();
        };
      });
      mm.add("(max-width: 767.98px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.from(planStatic, {
          opacity: 0,
          y: 24,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: planStatic, start: "top 85%", once: true },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    // overflow-x-clip, not overflow-hidden: the numeral bleeds above the section.
    <section ref={sectionRef} aria-labelledby="eg-heading" className="relative overflow-x-clip bg-white md:h-svh">
      <div className="relative px-4 pt-4 pb-20 md:grid md:h-full md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center md:gap-12 md:px-10 md:py-0">
        <span
          aria-hidden="true"
          className="-ml-[calc(1rem+0.08em)] block font-heading text-[44vw] leading-[0.78] font-bold tracking-tight text-ink-green md:pointer-events-none md:absolute md:top-0 md:left-0 md:z-20 md:m-0 md:-translate-x-[0.07em] md:-translate-y-[0.14em] md:text-[clamp(9rem,34vh,22rem)]"
        >
          {content.numeral}
        </span>

        <div className="relative z-10 mt-8 md:order-2 md:mt-0">
          <p
            data-eg-text
            className="font-ui text-xs tracking-[0.18em] text-accent-terracotta md:text-sm md:motion-safe:opacity-0"
          >
            {content.label}
          </p>
          <h2
            id="eg-heading"
            data-eg-text
            className="mt-4 max-w-[15em] font-heading text-[clamp(1.6rem,2.6vw,2.75rem)] leading-[1.08] font-semibold text-ink-green uppercase md:motion-safe:opacity-0"
          >
            {content.headline}
          </h2>
          <p
            data-eg-text
            className="mt-5 max-w-[34ch] font-body text-[clamp(1rem,1.2vw,1.15rem)] leading-relaxed text-ink-green md:motion-safe:opacity-0"
          >
            {content.story}
          </p>
          <p data-eg-text className="mt-6 md:motion-safe:opacity-0">
            <TransitionLink
              href={content.link.href}
              className="inline-block font-ui text-sm tracking-wide text-accent-terracotta underline-offset-4 hover:underline md:text-base"
            >
              {content.link.label} <span aria-hidden="true">→</span>
            </TransitionLink>
          </p>
        </div>

        <div className="relative mt-12 md:order-1 md:mt-0">
          {/* The world: desktop with motion only. Everything in it moves with the camera. */}
          <div
            data-eg-frame
            className="relative hidden w-full overflow-hidden md:motion-safe:block"
            style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
          >
            <div data-eg-world className="absolute inset-0">
              <div data-eg-map className="absolute inset-0">
                <Image src={content.map.src} alt={content.mapAlt} fill sizes="60vw" className="object-cover" />
              </div>
              {/* Placed with a transform: at this depth, a position rounded to a whole pixel would show. */}
              <div
                data-eg-plan
                className="absolute inset-0 origin-top-left opacity-0 mix-blend-multiply"
                style={{
                  transform: `translate(${((imageX / MAP_W) * 100).toFixed(4)}%, ${((imageY / MAP_H) * 100).toFixed(4)}%) scale(${(imageW / MAP_W).toFixed(6)})`,
                }}
              >
                <Image
                  src={sitePlan.src}
                  alt={content.sitePlanAlt}
                  width={sitePlan.width}
                  height={sitePlan.height}
                  sizes="75vw"
                  className="block h-auto w-full"
                />
              </div>
              <svg
                aria-hidden="true"
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                className="absolute inset-0 size-full overflow-visible"
              >
                <circle
                  data-eg-mark
                  cx={mapRing.cx}
                  cy={mapRing.cy}
                  r={mapRing.r}
                  fill="none"
                  stroke="#E2002C"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeDasharray="0 4.2"
                />
                <mask id="eg-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width={MAP_W} height={MAP_H}>
                  <polygon
                    data-eg-reveal
                    points={outlinePoints}
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    pathLength={1}
                    strokeDasharray="1"
                    strokeDashoffset="1"
                  />
                </mask>
                <g mask="url(#eg-reveal)">
                  <polygon
                    data-eg-boundary
                    points={outlinePoints}
                    fill="none"
                    stroke="#E2002C"
                    strokeLinecap="round"
                    strokeDasharray="0 0.5"
                    opacity="0"
                  />
                </g>
              </svg>
              <div
                data-eg-mark
                aria-hidden="true"
                className="absolute size-3 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${mapDot.x}%`, top: `${mapDot.y}%` }}
              >
                <span className="map-pulse absolute inset-0 rounded-full border-2 border-white" />
                <span className="absolute inset-0 rounded-full border-2 border-white bg-thesis-teal" />
              </div>
            </div>
          </div>

          <button
            type="button"
            data-eg-replay
            className="invisible mt-4 hidden cursor-pointer font-ui text-sm tracking-wide text-accent-terracotta underline-offset-4 opacity-0 hover:underline md:motion-safe:block"
          >
            <span aria-hidden="true">↻ </span>
            {content.replayLabel}
          </button>

          {/* Phones and reduced motion: wider than its column so her drawing fills it. */}
          <div className="-ml-[8%] w-[130%] md:pointer-events-none md:-ml-[8.3%] md:w-[139%] md:motion-safe:hidden">
            <div data-eg-plan-static className="w-full">
              <Image
                src={sitePlan.src}
                alt={content.sitePlanAlt}
                width={sitePlan.width}
                height={sitePlan.height}
                sizes="(max-width: 768px) 130vw, 75vw"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <Grain surface="white" />
    </section>
  );
}
