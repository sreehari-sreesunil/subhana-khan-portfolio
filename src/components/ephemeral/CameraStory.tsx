"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Grain from "@/components/Grain";
import { LATE_WINDOW } from "@/components/sheet/SheetBlock";
import { act1, act3, act4, images } from "@/content/ephemeral-ground";
import { ephemeralGroundPreview as home } from "@/content/home";
import { createCamera, type CameraStop } from "@/lib/camera";
import { MAP_H, MAP_W, storyOutlinePoints } from "@/lib/ephemeral-geometry";
import SiteBoundary from "./SiteBoundary";
import SlownessMotif, { WALK_FROM } from "./SlownessMotif";
import ZoneShapes from "./ZoneShapes";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PAPER_OPACITY = 0.88;
const DOT_PX = 4;
const planImage = images[act4.masterplan.image.name];

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
      const planWorld = root?.querySelector<HTMLElement>("[data-plan-world]");
      const planWindow = root?.querySelector<HTMLElement>("[data-plan-window]");
      const stage = planWorld?.parentElement;
      if (!root || !world || !boundary || !planWorld || !planWindow || !stage) return;

      const mm = gsap.matchMedia();
      mm.add({ stage: "(min-width: 768px) and (prefers-reduced-motion: no-preference)", plan: LATE_WINDOW }, (context) => {
        if (!context.conditions?.stage) return;
        const withPlan = Boolean(context.conditions.plan);
        const siteScale = act3.site.stop.scale;
        // Worked out from the window once it's measured: the camera ends with the plan exactly behind it.
        const planStop: CameraStop = { center: act3.site.stop.center, scale: siteScale };
        const planBox = { left: 0, top: 0, width: 1 };
        const { onMap } = act4.masterplan;

        // The plan's second world: a sharp image at its final size, kept glued to its place on the map
        // while the camera moves, and at scale 1 once it arrives. The map scaled it would be soft.
        const placePlan = () => {
          const frame = stage.getBoundingClientRect();
          const map = world.getBoundingClientRect();
          const unit = map.width / MAP_W;
          gsap.set(planWorld, {
            x: map.left - frame.left + onMap.left * unit - planBox.left,
            y: map.top - frame.top + onMap.top * unit - planBox.top,
            scale: (onMap.width * unit) / planBox.width,
            transformOrigin: "0 0",
            force3D: false,
          });
        };

        const camera = createCamera({
          world,
          size: { width: MAP_W, height: MAP_H },
          stops: [...[...act1.stops, act3.site.stop].map(({ center, scale }) => ({ center, scale })), ...(withPlan ? [planStop] : [])],
          // The outline's dots stay the same size on screen as the camera closes in.
          onMove: (scale) => {
            boundary.setAttribute("stroke-width", String((DOT_PX * MAP_W) / (world.clientWidth * scale)));
            if (withPlan && scale >= Math.min(siteScale, planStop.scale)) placePlan();
          },
        });

        const measure = () => {
          const sheet = planWindow.closest(".sheet")?.getBoundingClientRect();
          if (!sheet) return;
          const box = planWindow.getBoundingClientRect();
          Object.assign(planBox, { left: box.left - sheet.left, top: box.top - sheet.top, width: box.width });
          gsap.set(planWorld, { left: planBox.left, top: planBox.top, width: box.width, height: box.height });
          const unit = world.clientWidth / MAP_W;
          planStop.scale = box.width / (onMap.width * unit);
          const pixels = planStop.scale * unit;
          planStop.center = {
            x: onMap.left - (planBox.left - stage.clientWidth / 2) / pixels,
            y: onMap.top - (planBox.top - stage.clientHeight / 2) / pixels,
          };
          camera.place();
        };
        const resized = new ResizeObserver(measure);
        if (withPlan) {
          measure();
          resized.observe(planWindow);
        }

        // Each leg's own ScrollTrigger reports how far along it is. One smoothed value follows their
        // sum, so a jump past several legs can never leave two tweens fighting over the camera.
        const smooth = gsap.quickTo(camera.state, "position", { duration: 0.6, ease: "power3", onUpdate: camera.place });
        const legs: ScrollTrigger[] = [];
        const follow = () => smooth(legs.reduce((sum, leg) => sum + leg.progress, 0));
        gsap.utils.toArray<HTMLElement>("[data-act-leg] [data-act-card]", root).forEach((card) => {
          if (card.hasAttribute("data-plan-leg") && !withPlan) return;
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

        // Her plan takes over from the map while the gap above 4.2 is in view.
        if (withPlan) {
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: "[data-plan-leg]", start: "top 140%", end: "top 50%", scrub: 0.6 },
            })
            .to(planWorld, { opacity: 1, duration: 0.6 }, 0)
            .fromTo(boundary, { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, 0)
            .to(world, { autoAlpha: 0, duration: 0.4 }, 0.6);
        }

        return () => resized.disconnect();
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="paper-fibre relative bg-paper">
      <div className="paper-fibre relative bg-paper px-4 pt-12 md:px-10 md:motion-safe:sticky md:motion-safe:top-0 md:motion-safe:h-svh md:motion-safe:overflow-hidden md:motion-safe:p-0">
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
        <div data-plan-world className="absolute hidden opacity-0 will-change-[transform,opacity] lg:motion-safe:block">
          <Image src={planImage.src} alt={act4.masterplan.image.alt} fill sizes="75vw" />
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
