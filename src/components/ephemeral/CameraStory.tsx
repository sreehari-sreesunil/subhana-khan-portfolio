"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Grain from "@/components/Grain";
import { act1, act3 } from "@/content/ephemeral-ground";
import { ephemeralGroundPreview as home } from "@/content/home";
import { createCamera } from "@/lib/camera";
import { MAP_H, MAP_W, storyOutlinePoints } from "@/lib/ephemeral-geometry";
import SiteBoundary from "./SiteBoundary";
import SlownessMotif, { WALK_FROM } from "./SlownessMotif";
import ZoneShapes from "./ZoneShapes";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PAPER_OPACITY = 0.88;
const DOT_PX = 4;

type CameraStoryProps = { titleId: string; title: string; children: ReactNode };

// The page's one sticky mechanism: a stage behind the acts, holding one camera over the map.
// Acts scroll over it. Phones and reduced motion have no stage; each act lays out its own frames.
export default function CameraStory({ titleId, title, children }: CameraStoryProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const world = root?.querySelector<HTMLElement>("[data-act-world]");
      const boundary = root?.querySelector<SVGElement>("[data-site-boundary]");
      if (!root || !world || !boundary) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const camera = createCamera({
          world,
          size: { width: MAP_W, height: MAP_H },
          stops: [...act1.stops, act3.site.stop].map(({ center, scale }) => ({ center, scale })),
          // The outline's dots stay the same size on screen as the camera closes in.
          onMove: (scale) => {
            boundary.setAttribute("stroke-width", String((DOT_PX * MAP_W) / (world.clientWidth * scale)));
          },
        });
        // Each leg's own ScrollTrigger reports how far along it is. One smoothed value follows their
        // sum, so a jump past several legs can never leave two tweens fighting over the camera.
        const smooth = gsap.quickTo(camera.state, "position", { duration: 0.6, ease: "power3", onUpdate: camera.place });
        const legs: ScrollTrigger[] = [];
        const follow = () => smooth(legs.reduce((sum, leg) => sum + leg.progress, 0));
        gsap.utils.toArray<HTMLElement>("[data-act-leg] [data-act-card]", root).forEach((card) => {
          legs.push(ScrollTrigger.create({ trigger: card, start: "top bottom", end: "top 45%", onUpdate: follow, onRefresh: follow }));
        });

        // Tracing paper over the parked island: it settles as Act 2 arrives, and lifts again for 2.6.
        // As with the camera, one smoothed value follows both, so a long jump can't leave them fighting.
        const paper = gsap.quickTo("[data-stage-paper]", "opacity", { duration: 0.6, ease: "power3" });
        const edges: ScrollTrigger[] = [];
        const followPaper = () => {
          const [arrive, lift] = edges;
          if (!arrive || !lift) return;
          paper(PAPER_OPACITY * (arrive.progress - lift.progress));
        };
        ["#act-2", "#back-to-the-island"].forEach((trigger) => {
          edges.push(ScrollTrigger.create({ trigger, start: "top 90%", end: "top 25%", onUpdate: followPaper, onRefresh: followPaper }));
        });

        // Once the paper is down the walker crosses 2.1, gone before the next heading; the tree stays put.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: "#slowness", start: "top 25%", end: "bottom bottom", scrub: 1 },
          })
          .to("[data-stage-motif]", { opacity: 1, duration: 0.1 }, 0)
          .fromTo("[data-stage-motif] [data-walker]", { xPercent: WALK_FROM }, { xPercent: 0, duration: 1 }, 0)
          .to("[data-stage-motif]", { opacity: 0, duration: 0.1 }, 0.9);

        // The act's title goes as the first sheet lands: it would otherwise show through a window.
        gsap.to("[data-stage-title]", {
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: "#ocean", start: "top bottom", end: "top 80%", scrub: 0.3 },
        });

        // The zones belong to 1.4's sheets alone: its sheet raises each one, this keeps them to its stretch of the page.
        const fade = 0.06;
        gsap
          .timeline({
            defaults: { ease: "none", duration: fade },
            scrollTrigger: { trigger: "#proposal", start: "top 80%", end: "bottom 30%", scrub: 0.6 },
          })
          .to("[data-stage-zones]", { opacity: 1 }, 0)
          .to("[data-stage-zones]", { opacity: 0 }, 1 - fade);

        // Her outline draws on the coast as the camera arrives at the site.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: "#where-exactly [data-act-card]", start: "top 70%", end: "top 20%", scrub: 0.6 },
          })
          .to(boundary, { opacity: 1, duration: 0.1 }, 0)
          .to("[data-site-reveal]", { attr: { "stroke-dashoffset": 0 }, duration: 1 }, 0);
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="paper-fibre relative bg-paper">
      <div className="relative px-4 pt-12 md:px-10 md:motion-safe:sticky md:motion-safe:top-0 md:motion-safe:h-svh md:motion-safe:overflow-hidden md:motion-safe:p-0">
        {/* Covers the screen at any shape; its centre stays on the screen's centre. */}
        <div
          className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:motion-safe:block"
          style={{ width: `max(100%, calc(100svh * ${MAP_W} / ${MAP_H}))`, aspectRatio: `${MAP_W} / ${MAP_H}` }}
        >
          <div data-act-world className="absolute inset-0">
            <Image src={home.map.src} alt={home.mapAlt} fill sizes="100vw" loading="eager" />
            <svg aria-hidden="true" viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 size-full overflow-visible">
              <g data-stage-zones opacity="0">
                <ZoneShapes id="stage-zones" hidden />
              </g>
              <SiteBoundary id="story-site" dots="0 0.24" points={storyOutlinePoints} />
            </svg>
          </div>
        </div>
        <h2
          id={titleId}
          data-stage-title
          tabIndex={-1}
          className="font-heading text-[clamp(1.75rem,3.4vw,3.25rem)] font-semibold text-ink-green md:motion-safe:absolute md:motion-safe:bottom-9 md:motion-safe:left-10"
        >
          {title}
        </h2>
        <div className="hidden md:motion-safe:block">
          <Grain surface="colour" />
          <div data-stage-paper className="paper-fibre absolute inset-0 z-50 bg-paper opacity-0" />
          <div data-stage-motif className="absolute inset-x-0 bottom-[12%] z-50 h-[30svh] opacity-0">
            <SlownessMotif />
          </div>
          <p className="absolute right-10 bottom-3 z-50 font-ui text-[11px] text-ink-green/70">{act1.coastlineCredit}</p>
        </div>
      </div>

      {/* No z-index: each section's grain has to blend with the stage behind it. */}
      <div className="relative pb-16 md:motion-safe:-mt-[100svh] md:motion-safe:pb-0">{children}</div>
    </div>
  );
}
