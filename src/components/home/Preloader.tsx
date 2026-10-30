"use client";

import Image from "next/image";
import { Component, useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { preloader as content } from "@/content/home";
import { getLenis } from "@/components/SmoothScroll";
import { markPreloaderDone } from "@/lib/preloader";
import { PRELOADER_ATTR, PRELOADER_KEY } from "@/lib/preloader-script";

const YEAR_STEP = 0.3;
const MIN_SECONDS = 2.2;
const MAX_SECONDS = 5;
// After the CSS failsafe (globals.css) has faded the overlay: hands scrolling and state back.
const WATCHDOG_MS = 6600;

// A render error would otherwise replace the whole page, which no CSS failsafe can undo.
class PreloaderBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error("Preloader failed", error);
    document.querySelector("main[aria-busy]")?.removeAttribute("aria-busy");
    markPreloaderDone();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function Preloader() {
  return (
    <PreloaderBoundary>
      <Overlay />
    </PreloaderBoundary>
  );
}

// Rendered the same for everyone: the <head> script hides it on repeat visits, and CSS picks
// the reduced-motion version, so nothing here branches on storage or media queries.
function Overlay() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const html = document.documentElement;
    // Its own sibling: Next keeps visited pages hidden in the DOM, so there can be several <main>s.
    const main = root.nextElementSibling;

    if (html.hasAttribute(PRELOADER_ATTR)) {
      markPreloaderDone();
      return;
    }

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
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

    // Shared by the lift and the reduced-motion fade: `ratio` is how far the overlay has actually
    // moved, so the hero starts while it's still leaving and there's never an empty page.
    const leave = {
      onUpdate(this: gsap.core.Tween) {
        if (this.ratio >= 0.25) markPreloaderDone();
      },
      onComplete: finish,
    };

    // Scripts arrived after the CSS failsafe already removed the overlay: nothing left to play.
    if (getComputedStyle(root).visibility === "hidden") {
      finish();
      return;
    }

    main?.setAttribute("aria-busy", "true");
    const images = new AbortController();
    const watchdog = window.setTimeout(finish, WATCHDOG_MS);
    let ctx: gsap.Context | undefined;
    const play = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.to(root, { opacity: 0, delay: 0.6, duration: 0.4, ease: "power2.out", ...leave });
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
        gsap.to(root, { yPercent: -100, duration: 0.8, ease: "power3.out", ...leave });
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
    };

    // An error thrown from an effect would take the whole page down with it.
    try {
      getLenis()?.stop();
      ctx = gsap.context(play, root);
    } catch (error) {
      console.error("Preloader failed", error);
      finish();
    }

    return () => {
      window.clearTimeout(watchdog);
      images.abort();
      ctx?.revert();
      main?.removeAttribute("aria-busy");
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
