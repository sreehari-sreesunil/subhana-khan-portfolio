"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ephemeralGroundPreview as content } from "@/content/home";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MAP_W = content.map.width;
const MAP_H = content.map.height;
const DEPTH = 20;
const DOT_PX = 2.5;

// Her plan has the sea on its left; mirrored, it matches her p.10 sheet and the real east coast.
const { site, sitePlan } = content;
const imageW = site.widthUnits / (site.drawing.right - site.drawing.left);
const imageH = (imageW * sitePlan.height) / sitePlan.width;
const imageX = site.target.x - (1 - site.shore.x) * imageW;
const imageY = site.target.y - site.shore.y * imageH;
const planCentre = {
  x: imageX + (1 - (site.drawing.left + site.drawing.right) / 2) * imageW,
  y: imageY + ((site.drawing.top + site.drawing.bottom) / 2) * imageH,
};
const outlinePoints = site.outline
  .map(([x, y]) => `${(imageX + (1 - x) * imageW).toFixed(2)},${(imageY + y * imageH).toFixed(2)}`)
  .join(" ");

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export default function EphemeralGroundPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const { mapDot, mapRing } = content;

  // Desktop: the frame is sticky while one camera moves over one world (map, plan, outline).
  // Phones: the plan fades up once. Reduced motion: nothing moves (CSS shows the static plan).
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
      const planStatic = section.querySelector<HTMLElement>("[data-eg-plan-static]");
      if (!frame || !world || !map || !plan || !boundary || !reveal || !planStatic) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const camera = { progress: 0 };
        const placeCamera = () => {
          const p = camera.progress;
          // Equal scroll multiplies the scale by an equal amount.
          const zoom = clamp01((p - 0.1) / 0.7);
          const scale = DEPTH ** zoom;
          const toCentre = smoothstep(zoom);
          const settle = easeOutCubic(clamp01((p - 0.8) / 0.2));
          const focusX = lerp(site.target.x, planCentre.x, settle);
          const focusY = lerp(site.target.y, planCentre.y, settle);
          const screenX = lerp(site.target.x, MAP_W / 2, toCentre);
          const screenY = lerp(site.target.y, MAP_H / 2, toCentre);
          gsap.set(world, {
            xPercent: ((screenX - focusX * scale) / MAP_W) * 100,
            yPercent: ((screenY - focusY * scale) / MAP_H) * 100,
            scale,
            // 2D transform keeps the SVG re-rendered sharp at every scale.
            force3D: false,
          });
          // The boundary's dots stay the same size on screen as the camera closes in.
          boundary.setAttribute("stroke-width", String((DOT_PX * MAP_W) / (frame.clientWidth * scale)));
        };
        gsap.set(world, { transformOrigin: "0 0" });
        placeCamera();

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
              onRefresh: placeCamera,
            },
          })
          .to(camera, { progress: 1, duration: 1, onUpdate: placeCamera }, 0)
          .to(marks, { opacity: 0, duration: 0.2 }, 0.1)
          .set(boundary, { opacity: 1 }, 0.35)
          .fromTo(reveal, { attr: { "stroke-dashoffset": 1 } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.2 }, 0.35)
          .to(plan, { opacity: 1, duration: 0.3 }, 0.5)
          .to(map, { opacity: 0, duration: 0.3 }, 0.5);
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
              <div
                data-eg-plan
                className="absolute opacity-0"
                style={{
                  left: `${(imageX / MAP_W) * 100}%`,
                  top: `${(imageY / MAP_H) * 100}%`,
                  width: `${(imageW / MAP_W) * 100}%`,
                }}
              >
                <Image
                  src={sitePlan.src}
                  alt={content.sitePlanAlt}
                  width={sitePlan.width}
                  height={sitePlan.height}
                  sizes="75vw"
                  className="block h-auto w-full -scale-x-100"
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
                    strokeWidth="2"
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
                    strokeDasharray="0 0.7"
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

          {/* Phones and reduced motion: wider than its column so her drawing fills it. */}
          <div className="-ml-[8%] w-[130%] md:motion-safe:hidden">
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
    </section>
  );
}
