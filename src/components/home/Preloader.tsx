"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { preloader as content } from "@/content/home";
import { getLenis } from "@/components/SmoothScroll";
import { markPreloaderDone } from "@/lib/preloader";
import { PRELOADER_ATTR, PRELOADER_KEY } from "@/lib/preloader-script";

const YEAR_STEP = 0.3;
const MIN_SECONDS = 2.2;
const MAX_SECONDS = 5;

// Rendered the same for everyone: the <head> script hides it on repeat visits, and CSS picks
// the reduced-motion version, so nothing here branches on storage or media queries.
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const html = document.documentElement;
    // Its own sibling: Next keeps visited pages hidden in the DOM, so there can be several <main>s.
    const main = root.nextElementSibling;

    if (html.hasAttribute(PRELOADER_ATTR)) {
      main?.removeAttribute("aria-busy");
      markPreloaderDone();
      return;
    }

    const finish = () => {
      try {
        sessionStorage.setItem(PRELOADER_KEY, "1");
      } catch {
        // Storage unavailable: it simply shows again on the next load.
      }
      html.setAttribute(PRELOADER_ATTR, "");
      main?.removeAttribute("aria-busy");
      getLenis()?.start();
      markPreloaderDone();
    };

    getLenis()?.stop();
    const images = new AbortController();
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.to(root, { opacity: 0, delay: 0.6, duration: 0.4, ease: "power2.out", onComplete: finish });
        return;
      }

      const counter = root.querySelector<HTMLElement>("[data-preloader-counter]");
      const frames = gsap.utils.toArray<HTMLElement>("[data-preloader-frame]", root);
      const timeline = gsap.timeline();
      content.years.forEach(({ year }, i) => {
        timeline.call(() => {
          if (counter) counter.textContent = String(year);
        }, undefined, i * YEAR_STEP);
        // The images differ in shape, so the previous one has to go or it shows around the next.
        if (i > 0) timeline.set(frames[i - 1], { opacity: 0 }, i * YEAR_STEP);
        timeline.fromTo(
          frames[i],
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" },
          i * YEAR_STEP,
        );
      });

      let minElapsed = false;
      let heroLoaded = false;
      const liftWhenReady = () => {
        if (!minElapsed || !heroLoaded) return;
        minElapsed = false;
        gsap.to(root, { yPercent: -100, duration: 0.8, ease: "power3.out", onComplete: finish });
      };

      gsap.delayedCall(MIN_SECONDS, () => {
        minElapsed = true;
        liftWhenReady();
      });
      gsap.delayedCall(MAX_SECONDS, () => {
        heroLoaded = true;
        liftWhenReady();
      });

      // Only images on screen: lazy ones further down won't load until the reader scrolls.
      const pending = [...document.querySelectorAll<HTMLImageElement>(".hero img")].filter(
        (img) => !img.complete && img.getBoundingClientRect().top < window.innerHeight,
      );
      let remaining = pending.length;
      const settle = () => {
        remaining -= 1;
        if (remaining > 0) return;
        heroLoaded = true;
        liftWhenReady();
      };
      if (remaining === 0) heroLoaded = true;
      pending.forEach((img) => {
        img.addEventListener("load", settle, { once: true, signal: images.signal });
        img.addEventListener("error", settle, { once: true, signal: images.signal });
      });
    }, root);

    return () => {
      images.abort();
      ctx.revert();
      getLenis()?.start();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="preloader fixed inset-0 z-[60] flex items-center justify-center bg-white px-4"
    >
      <div className="flex items-center gap-3 md:gap-8">
        <div>
          <p
            data-preloader-counter
            className="font-heading text-[clamp(4.5rem,19vw,20rem)] leading-none font-bold tracking-tight text-ink-green tabular-nums motion-reduce:hidden"
          >
            {content.years[0].year}
          </p>
          <p className="hidden font-heading text-[clamp(3.5rem,15vw,16rem)] leading-none font-bold tracking-tight text-ink-green motion-reduce:block">
            {content.staticYears}
          </p>
          <p className="mt-3 font-ui text-sm tracking-wide text-accent-terracotta md:mt-4 md:text-base">
            {content.label}
          </p>
        </div>

        <div className="relative aspect-[4/3] w-[clamp(7.5rem,27vw,26rem)] motion-reduce:hidden">
          {content.years.map(({ year, image }) => (
            <div key={year} data-preloader-frame className="absolute inset-0 opacity-0">
              <Image
                src={image.src}
                alt=""
                fill
                sizes="27vw"
                loading="eager"
                className="object-contain object-left"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
