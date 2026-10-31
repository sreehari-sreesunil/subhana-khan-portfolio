"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type SnapStripProps = {
  label: string;
  hint: string;
  /** It fits the page on desktop, so the controls are for phones only. */
  fitsDesktop?: boolean;
  /** No page margins, for a sheet that has its own. */
  flush?: boolean;
  children: ReactNode;
};

// A native sideways scroller, so nothing is pinned and touch just works. It rests on each [data-snap]
// inside it. The arrows and the line under it show there's more, and serve mice without sideways scroll.
export default function SnapStrip({ label, hint, fitsDesktop, flush, children }: SnapStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      setAtStart(track.scrollLeft < 2);
      setAtEnd(track.scrollLeft > max - 2);
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? track.scrollLeft / max : 1})`;
    };
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const inset = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
    const left = track.getBoundingClientRect().left;
    const stops = Array.from(track.querySelectorAll("[data-snap]"), (stop) => stop.getBoundingClientRect().left - left + track.scrollLeft - inset);
    const target = direction > 0 ? stops.find((stop) => stop > track.scrollLeft + 8) : stops.findLast((stop) => stop < track.scrollLeft - 8);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: target ?? (direction > 0 ? track.scrollWidth : 0), behavior: reduce ? "auto" : "smooth" });
  };

  const arrow = "px-2 py-1 text-base text-ink-green transition-opacity duration-300 ease-out disabled:opacity-30";

  return (
    <div>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={`flex snap-x snap-mandatory gap-8 overflow-x-auto [scrollbar-width:none] md:snap-proximity md:gap-14 [&::-webkit-scrollbar]:hidden ${flush ? "" : "scroll-pl-4 px-4 md:scroll-pl-10 md:px-10"}`}
      >
        {children}
      </div>
      <div className={`mt-5 flex items-center gap-4 font-ui text-xs tracking-wide text-accent-terracotta ${flush ? "" : "px-4 md:px-10"} ${fitsDesktop ? "md:hidden" : ""}`}>
        <span>{hint}</span>
        <span aria-hidden="true" className="relative h-px flex-1 bg-ink-green/20">
          <span ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-accent-terracotta" />
        </span>
        <button type="button" aria-label="Previous" disabled={atStart} onClick={() => step(-1)} className={arrow}>
          ←
        </button>
        <button type="button" aria-label="Next" disabled={atEnd} onClick={() => step(1)} className={arrow}>
          →
        </button>
      </div>
    </div>
  );
}
