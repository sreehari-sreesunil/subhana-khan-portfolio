"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { site } from "@/content/site";
import {
  ARC,
  kochiDay,
  MINUTES_IN_DAY,
  minutesToX,
  skyLayers,
  sunAltitude,
  sunCaption,
  xToMinutes,
  xToY,
  type SunDay,
} from "@/lib/sun";

const KEY_STEP = 15;
const KEY_RELEASE_MS = 2500;
const TICK_MS = 15000;

const arcPath = Array.from({ length: 81 }, (_, i) => {
  const x = ARC.left + ((ARC.right - ARC.left) * i) / 80;
  return `${i ? "L" : "M"}${(x * 1000).toFixed(1)} ${(xToY(x) * 1000).toFixed(1)}`;
}).join("");

const hillLine =
  "M0 790 C60 776 118 748 186 752 C246 756 288 716 352 712 C410 708 452 742 512 746 C566 750 604 728 664 734 C738 742 790 702 856 716 C908 728 956 752 1000 748";

const stars = Array.from({ length: 34 }, (_, i) => ({
  left: `${(((i * 37 + 11) % 97) + 1.5).toFixed(1)}%`,
  top: `${(((i * 61 + 7) % 58) + 3).toFixed(1)}%`,
  size: i % 5 === 0 ? 3 : 2,
}));

// The server draws a neutral day sky with no sun: the time is only known in the browser, and
// everything that depends on it is written to the DOM after mount, so React never sees a difference.
export default function SunPath() {
  const rootRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const caption = captionRef.current;
    if (!root || !caption) return;
    const layer = (name: string) => root.querySelector<HTMLElement>(`[data-sky="${name}"]`);
    const sun = layer("sun");
    const sand = layer("sand");
    const terracotta = layer("terracotta");
    const night = layer("night");
    const dayArc = root.querySelector<SVGElement>("[data-arc='day']");
    const nightArc = root.querySelector<SVGElement>("[data-arc='night']");
    if (!sun || !sand || !terracotta || !night || !dayArc || !nightArc) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const clock = { minutes: 0 };
    let day: SunDay = kochiDay(Date.now());
    let scrubbing = false;
    let dragging = false;
    let glide: gsap.core.Tween | null = null;
    let keyTimer: number | undefined;

    const nowMinutes = () => {
      day = kochiDay(Date.now());
      return (Date.now() - day.start) / 60000;
    };

    const draw = (minutes: number) => {
      clock.minutes = minutes;
      const x = minutesToX(day, minutes);
      sun.style.transform = `translate(${(x * 100).toFixed(2)}%, ${(xToY(x) * 100).toFixed(2)}%)`;
      const sky = skyLayers(sunAltitude(day, minutes));
      sand.style.opacity = String(sky.sand);
      terracotta.style.opacity = String(sky.terracotta);
      night.style.opacity = String(sky.night);
      nightArc.style.opacity = String(sky.night);
      dayArc.style.opacity = String(1 - sky.night);
      const text = sunCaption(day, minutes);
      caption.textContent = text;
      root.setAttribute("aria-valuenow", String(Math.round(minutes)));
      root.setAttribute("aria-valuetext", text);
    };

    const stopGlide = () => {
      glide?.kill();
      glide = null;
    };
    const scrubTo = (minutes: number) => {
      stopGlide();
      scrubbing = true;
      draw(Math.min(MINUTES_IN_DAY - 1, Math.max(0, minutes)));
    };
    const release = () => {
      window.clearTimeout(keyTimer);
      scrubbing = false;
      const now = nowMinutes();
      if (reduced.matches) {
        draw(now);
        return;
      }
      stopGlide();
      glide = gsap.to(clock, {
        minutes: now,
        duration: 0.9,
        ease: "power2.out",
        onUpdate: () => draw(clock.minutes),
        onComplete: () => {
          glide = null;
        },
      });
    };

    const fromPointer = (event: PointerEvent) => {
      const box = root.getBoundingClientRect();
      scrubTo(xToMinutes(day, (event.clientX - box.left) / box.width));
    };
    const onDown = (event: PointerEvent) => {
      dragging = true;
      root.setPointerCapture(event.pointerId);
      fromPointer(event);
    };
    const onMove = (event: PointerEvent) => {
      if (dragging || event.pointerType === "mouse") fromPointer(event);
    };
    const onUp = (event: PointerEvent) => {
      dragging = false;
      // A mouse may still be hovering; it glides back when it leaves.
      if (event.pointerType !== "mouse") release();
    };
    const onCancel = () => {
      dragging = false;
      release();
    };
    const onLeave = (event: PointerEvent) => {
      if (!dragging && event.pointerType === "mouse" && scrubbing) release();
    };
    const onKey = (event: KeyboardEvent) => {
      const steps: Record<string, number> = {
        ArrowRight: clock.minutes + KEY_STEP,
        ArrowUp: clock.minutes + KEY_STEP,
        ArrowLeft: clock.minutes - KEY_STEP,
        ArrowDown: clock.minutes - KEY_STEP,
        Home: 0,
        End: MINUTES_IN_DAY - 1,
      };
      const next = steps[event.key];
      if (next === undefined) return;
      event.preventDefault();
      scrubTo(next);
      window.clearTimeout(keyTimer);
      keyTimer = window.setTimeout(release, KEY_RELEASE_MS);
    };
    const onBlur = () => {
      if (scrubbing) release();
    };

    draw(nowMinutes());
    sun.style.opacity = "1";

    const tick = window.setInterval(() => {
      if (!scrubbing && !glide) draw(nowMinutes());
    }, TICK_MS);

    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onCancel);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("keydown", onKey);
    root.addEventListener("blur", onBlur);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(keyTimer);
      stopGlide();
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onCancel);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("keydown", onKey);
      root.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <div>
      <div
        ref={rootRef}
        role="slider"
        tabIndex={0}
        aria-label={site.sunPath.label}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={MINUTES_IN_DAY - 1}
        aria-valuenow={720}
        className="relative h-[clamp(15rem,46svh,30rem)] w-full touch-pan-y overflow-hidden bg-paper-white outline-offset-[-4px] outline-accent-terracotta select-none focus-visible:outline-2"
      >
        <div data-sky="sand" className="absolute inset-0 bg-sand opacity-0" />
        <div data-sky="terracotta" className="absolute inset-0 bg-accent-terracotta opacity-0" />
        <div data-sky="night" className="absolute inset-0 bg-ink-green opacity-0">
          {stars.map((star) => (
            <span
              key={`${star.left}-${star.top}`}
              className="absolute rounded-full bg-paper-white"
              style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
            />
          ))}
          <span className="absolute top-[14%] left-[74%] size-[clamp(1.75rem,3.5vw,3rem)] rounded-full bg-paper-white" />
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full"
        >
          {/* Dashes with a darker edge, as on her p.28: a wide stroke under a narrower one. */}
          <g data-arc="day" fill="none" strokeLinecap="round" strokeDasharray="16 22">
            <path d={arcPath} stroke="var(--accent-terracotta)" strokeWidth="6" vectorEffect="non-scaling-stroke" />
            <path d={arcPath} stroke="var(--sun)" strokeWidth="3.5" vectorEffect="non-scaling-stroke" />
          </g>
          <path
            data-arc="night"
            d={arcPath}
            fill="none"
            stroke="var(--sand)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="4 18"
            vectorEffect="non-scaling-stroke"
            opacity="0"
          />
        </svg>

        {/* The sun's box is the whole sky, so a percentage transform is a position in the sky. */}
        <div data-sky="sun" className="pointer-events-none absolute inset-0 opacity-0">
          <span className="absolute top-0 left-0 size-[clamp(2.5rem,5vw,4.5rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-accent-terracotta/70 bg-sun" />
        </div>

        {/* TEMP: replace with her Hillside School section when it arrives. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <path d={`${hillLine} L1000 1000 L0 1000 Z`} fill="var(--paper)" />
          <path d={hillLine} fill="none" stroke="var(--ink-green)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* TEMP: replace with her Hillside School section when it arrives. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 220 110"
          className="pointer-events-none absolute bottom-[23%] left-[60%] h-[16%] w-auto"
          fill="var(--paper)"
          stroke="var(--ink-green)"
          strokeWidth="2"
          strokeLinejoin="round"
        >
          <path d="M4 108 L5 42 L92 40 L93 108 Z" />
          <path d="M93 108 L94 14 L214 12 L215 108 Z" />
          <path d="M112 34 L140 33 L140 60 L112 61 Z M160 33 L192 32 L192 60 L160 60 Z M20 60 L46 59 L46 84 L20 84 Z" />
        </svg>
      </div>

      <p
        ref={captionRef}
        className="px-4 pt-4 font-ui text-sm tracking-wide text-accent-terracotta md:px-10 md:text-base"
      >
        {site.sunPath.neutral}
      </p>
    </div>
  );
}
