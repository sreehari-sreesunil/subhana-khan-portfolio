"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Grain from "@/components/Grain";
import { act2, images } from "@/content/ephemeral-ground";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const { title, quadrants } = act2.strategies;

// Her sketches are small crops: shown a little under their own size, so they stay sharp.
const SKETCH_SCALE = 0.85;

// Grid cell, and where each label sits: at its own end of the axes, turning clockwise, as on her page.
const places = [
  { cell: "lg:pt-11", label: "lg:top-0 lg:right-[calc(50%+1.25rem)]" },
  { cell: "lg:pb-11", label: "lg:right-0 lg:bottom-[calc(50%+0.75rem)]" },
  { cell: "lg:pt-11", label: "lg:top-[calc(50%+0.75rem)] lg:left-0" },
  { cell: "lg:pb-11", label: "lg:bottom-0 lg:left-[calc(50%+1.25rem)]" },
];
// Defence, Social, Economy, Environment: clockwise round the axes.
const CLOCKWISE = [0, 1, 3, 2];

// Drawn from the centre out, so each half-axis is its own stroke. pathLength="1" makes the dash maths one line.
const AXIS_STROKES = ["M500 11 L0 13", "M500 11 L1000 8", "M500 14 L46 15", "M500 14 L960 12"];

function Axis({ vertical }: { vertical?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={vertical ? "0 0 24 1000" : "0 0 1000 24"}
      preserveAspectRatio="none"
      className={`absolute hidden lg:block ${vertical ? "inset-y-0 left-1/2 h-full w-6 -translate-x-1/2" : "inset-x-0 top-1/2 h-6 w-full -translate-y-1/2"}`}
    >
      <g transform={vertical ? "rotate(90) translate(0 -24)" : undefined}>
        {AXIS_STROKES.map((d, i) => (
          <path key={d} data-axis d={d} pathLength={1} strokeDasharray={1} fill="none" className="stroke-ink-green" strokeWidth={i < 2 ? 2 : 1} />
        ))}
      </g>
    </svg>
  );
}

export default function Strategies() {
  const rootRef = useRef<HTMLDivElement>(null);
  // Next keeps visited pages alive; coming back to one must not replay it.
  const played = useRef(false);

  useGSAP(
    () => {
      if (played.current) return;
      const root = rootRef.current;
      const groups = gsap.utils.toArray<HTMLElement>("[data-quadrant]", root);
      const items = gsap.utils.toArray<HTMLElement>("[data-strategy]", root);
      const labels = gsap.utils.toArray<HTMLElement>("[data-axis-label]", root);

      const mm = gsap.matchMedia();
      mm.add(
        {
          diagram: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          list: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (context.conditions?.diagram) {
            gsap.set("[data-axis]", { strokeDashoffset: 1 });
            gsap.set("[data-axis-ring]", { opacity: 0 });
            gsap.set(labels, { opacity: 0 });
            gsap.set(items, { opacity: 0, y: 10 });
            const timeline = gsap.timeline({
              scrollTrigger: { trigger: "[data-axes]", start: "center 60%", once: true },
              defaults: { ease: "power2.out" },
              onComplete: () => {
                played.current = true;
              },
            });
            timeline
              .to("[data-axis]", { strokeDashoffset: 0, duration: 1.4 })
              .to("[data-axis-ring]", { opacity: 1, duration: 0.8 }, "-=0.7")
              .to(labels, { opacity: 1, duration: 0.8, stagger: 0.15 }, "-=0.4");
            CLOCKWISE.forEach((index, i) => {
              const group = groups[index].querySelectorAll("[data-strategy]");
              timeline.to(group, { opacity: 1, y: 0, duration: 1.2, stagger: 0.25 }, i ? "-=0.5" : "-=0.2");
            });
            return;
          }
          const y = context.conditions?.reduce ? 0 : 10;
          gsap.set(items, { opacity: 0, y });
          ScrollTrigger.batch(items, {
            start: "top 85%",
            once: true,
            onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", stagger: 0.25 }),
          });
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} id="strategies" className="paper-fibre relative bg-thesis-teal px-4 pt-16 pb-20 md:px-10 lg:py-[14svh]">
      <h3 className="text-center font-heading text-[clamp(1.5rem,3vw,2.75rem)] font-semibold text-paper-white">{title}</h3>

      <div data-axes className="relative mx-auto mt-8 max-w-xl lg:mt-12 lg:grid lg:max-w-[88rem] lg:grid-cols-2 lg:grid-rows-2 lg:gap-x-16">
        <Axis />
        <Axis vertical />
        <svg
          aria-hidden="true"
          data-axis-ring
          viewBox="-110 -110 220 220"
          className="absolute top-1/2 left-1/2 hidden h-44 w-44 -translate-x-1/2 -translate-y-1/2 lg:block"
        >
          <path d="M-100 12A100 100 0 0 1-22-97" fill="none" className="stroke-ink-green" strokeWidth={0.8} />
          <path d="M-84 34A90 90 0 0 0 64 64" fill="none" className="stroke-ink-green" strokeWidth={0.8} />
          <circle cx={-27} cy={-85} r={7} className="fill-ink-green" />
          <circle cx={60} cy={75} r={3} className="fill-ink-green" />
        </svg>

        {quadrants.map((quadrant, q) => (
          <div key={quadrant.label} data-quadrant className={`mt-12 first:mt-0 lg:mt-0 ${places[q].cell}`}>
            <h4
              data-axis-label
              className={`font-heading text-[clamp(1.1rem,1.5vw,1.35rem)] font-semibold tracking-wide text-paper-white lg:absolute ${places[q].label}`}
            >
              {quadrant.label}
            </h4>
            <ul className="mt-4 space-y-5 lg:mt-0">
              {quadrant.items.map((item) => {
                const image = images[item.image.name];
                return (
                  <li
                    key={item.text}
                    data-strategy
                    className="rounded-sm bg-paper-white/15 p-4 lg:flex lg:items-center lg:gap-6 lg:bg-transparent lg:p-0 lg:even:flex-row-reverse"
                  >
                    <Image
                      src={image.src}
                      alt={item.image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="(max-width: 1024px) 80vw, 15vw"
                      // A set width, so the page's height is right before the image loads.
                      style={{ width: image.width * SKETCH_SCALE }}
                      className="mx-auto block h-auto max-w-full shrink-0 lg:mx-0 lg:max-w-[38%]"
                    />
                    <p className="mt-3 flex-1 font-body text-[0.95rem] leading-relaxed text-ink-green lg:mt-0 lg:text-[clamp(0.85rem,1vw,0.95rem)]">
                      {item.text}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <Grain surface="colour" />
    </div>
  );
}
