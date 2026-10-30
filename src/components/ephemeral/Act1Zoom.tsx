"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Grain from "@/components/Grain";
import { ephemeralGroundPreview as home } from "@/content/home";
import { createCamera, type CameraStop } from "@/lib/camera";
import { MAP_H, MAP_W } from "@/lib/ephemeral-geometry";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// How tall the world is against the frame in the static version: the island fills about 70% of it.
const STATIC_HEIGHT = "2500%";

type Act1ZoomProps = { id: string; title: string; credit: string; stops: CameraStop[] };

// The page's one sticky mechanism. Desktop: scroll drives the camera from ocean to island.
// Phones and reduced motion: a framed map that crossfades to the island, with nothing moving.
export default function Act1Zoom({ id, title, credit, stops }: Act1ZoomProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const island = stops[stops.length - 1];

  useGSAP(
    () => {
      const section = sectionRef.current;
      const world = section?.querySelector<HTMLElement>("[data-act-world]");
      const staticIsland = section?.querySelector<HTMLElement>("[data-act-island]");
      if (!section || !world || !staticIsland) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const camera = createCamera({ world, size: { width: MAP_W, height: MAP_H }, stops });
        gsap
          .timeline({
            defaults: { ease: "none" },
            onUpdate: camera.place,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          .to(camera.state, { position: stops.length - 1, duration: 1 });
      });
      mm.add("(max-width: 767.98px), (prefers-reduced-motion: reduce)", () => {
        gsap.fromTo(
          staticIsland,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top 70%", end: "top top", scrub: true },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id={id} aria-labelledby={`${id}-title`} className="relative md:motion-safe:h-[300svh]">
      <div className="relative h-svh overflow-hidden md:motion-safe:sticky md:motion-safe:top-0">
        {/* Covers the screen at any shape; its centre stays on the screen's centre. */}
        <div
          className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:motion-safe:block"
          style={{ width: `max(100%, calc(100svh * ${MAP_W} / ${MAP_H}))`, aspectRatio: `${MAP_W} / ${MAP_H}` }}
        >
          <div data-act-world className="absolute inset-0">
            <Image src={home.map.src} alt={home.mapAlt} fill sizes="100vw" loading="eager" />
          </div>
        </div>

        <div className="absolute inset-0 md:motion-safe:hidden">
          <Image src={home.map.src} alt={home.mapAlt} fill sizes="100vw" className="object-cover" />
          <div data-act-island className="absolute inset-0 opacity-0">
            <div
              className="absolute top-1/2 left-1/2"
              style={{
                height: STATIC_HEIGHT,
                aspectRatio: `${MAP_W} / ${MAP_H}`,
                transform: `translate(${-(island.center.x / MAP_W) * 100}%, ${-(island.center.y / MAP_H) * 100}%)`,
              }}
            >
              <Image src={home.map.src} alt="" fill sizes="100vw" />
            </div>
          </div>
        </div>

        <h2
          id={`${id}-title`}
          tabIndex={-1}
          className="absolute bottom-10 left-4 font-heading text-[clamp(2rem,5vw,4.5rem)] font-semibold text-ink-green md:left-10"
        >
          {title}
        </h2>
        <p className="absolute right-4 bottom-3 font-ui text-[11px] text-ink-green/70 md:right-10">{credit}</p>
        <Grain surface="colour" />
      </div>
    </section>
  );
}
