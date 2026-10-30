"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useTransition,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Grain from "@/components/Grain";
import { getLenis } from "@/components/SmoothScroll";
import { TORN_WIDTH, tornBodyPath } from "@/components/home/SpeechBubble";
import { site } from "@/content/site";
import { holdHero, markPreloaderSeen, releaseHero } from "@/lib/preloader";

gsap.registerPlugin(ScrollTrigger);

const COVER_SECONDS = 0.45;
const REVEAL_SECONDS = 0.45;
const FADE_SECONDS = 0.2;
const READY_TIMEOUT_SECONDS = 3;

// One outline per shape of screen, so stretching doesn't turn the torn bites into spikes.
const SHEET_WIDE_H = 700;
const SHEET_TALL_H = 2300;
const SHEET_WIDE_PATH = tornBodyPath(20261031, SHEET_WIDE_H, 0);
const SHEET_TALL_PATH = tornBodyPath(20261031, SHEET_TALL_H, 0);

type Phase = "idle" | "covering" | "waiting" | "settling" | "revealing";

type PageTransitionApi = { navigate: (href: string) => void; isBusy: () => boolean };

const PageTransitionContext = createContext<PageTransitionApi>({ navigate: () => {}, isBusy: () => false });
export const usePageTransition = () => useContext(PageTransitionContext);

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Next keeps visited pages in the DOM, hidden, so the first <main> may not be the one on screen.
function visibleMain() {
  return [...document.querySelectorAll("main")].find((main) => main.getClientRects().length > 0);
}

// The section a link's #hash points to, on the page now showing.
function linkedSection(href: string) {
  const { hash } = new URL(href, window.location.href);
  return hash ? visibleMain()?.querySelector(hash) : null;
}

function focusHeading(href: string) {
  const heading = (linkedSection(href) ?? visibleMain())?.querySelector<HTMLElement>("h1, h2");
  if (!heading) return;
  heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });
}

/** For links to the page already showing: Next's own scroll doesn't reach Lenis. */
export function scrollToLink(href: string) {
  const section = linkedSection(href);
  const top = section ? section.getBoundingClientRect().top + window.scrollY : 0;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(top, { duration: 0.8, easing: (t) => 1 - (1 - t) ** 3 });
  else window.scrollTo(0, top);
}

function resetScroll(href: string) {
  const section = linkedSection(href);
  const top = section ? section.getBoundingClientRect().top + window.scrollY : 0;
  window.scrollTo(0, top);
  getLenis()?.scrollTo(top, { immediate: true, force: true });
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [navigating, startNavigation] = useTransition();
  const sheetRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const phase = useRef<Phase>("idle");
  const target = useRef("");
  const link = useRef("");
  const queued = useRef<string | null>(null);
  const pushed = useRef(false);
  const failsafe = useRef<gsap.core.Tween | null>(null);
  const motion = useRef<gsap.core.Tween | null>(null);
  const fromHistory = useRef(false);

  const end = useCallback(() => {
    const sheet = sheetRef.current;
    failsafe.current?.kill();
    motion.current?.kill();
    if (sheet) gsap.set(sheet, { display: "none", clearProps: "opacity,transform" });
    releaseHero();
    getLenis()?.start();
    queued.current = null;
    pushed.current = false;
    phase.current = "idle";
  }, []);

  function reveal() {
    const sheet = sheetRef.current;
    if (!sheet) return;
    phase.current = "revealing";
    motion.current = gsap.to(sheet, {
      ...(prefersReducedMotion()
        ? { opacity: 0, duration: FADE_SECONDS, ease: "power1.out" }
        : { yPercent: -100, duration: REVEAL_SECONDS, ease: "power2.out" }),
      onUpdate(this: gsap.core.Tween) {
        if (this.ratio >= 0.25) releaseHero();
      },
      onComplete() {
        const next = queued.current;
        end();
        if (next) navigate(next);
        else focusHeading(link.current);
      },
    });
  }

  // Runs while covered, whether the page arrived or the failsafe gave up waiting.
  function settle() {
    if (phase.current !== "waiting") return;
    phase.current = "settling";
    failsafe.current?.kill();
    resetScroll(link.current);
    // Two frames: effects of the new page, then its layout, before measuring.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // A newer click may have sent the sheet back to waiting.
        if (phase.current !== "settling") return;
        ScrollTrigger.refresh();
        resetScroll(link.current);
        reveal();
      });
    });
  }

  function aim(href: string) {
    const path = new URL(href, window.location.href).pathname;
    link.current = href;
    target.current = path;
    router.prefetch(href);
    if (nameRef.current) nameRef.current.textContent = site.pageNames[path] ?? "";
    // The sheet is the welcome here: skip the preloader, and replay the hero behind the sheet.
    if (path === "/" && window.location.pathname !== "/") {
      markPreloaderSeen();
      holdHero();
    }
  }

  function go() {
    phase.current = "waiting";
    failsafe.current?.kill();
    failsafe.current = gsap.delayedCall(READY_TIMEOUT_SECONDS, settle);
    // Already there, with nothing on its way: only the reveal is left.
    if (target.current === window.location.pathname && !pushed.current) {
      settle();
      return;
    }
    // A retarget replaces the entry, so Back never lands on a page the reader never saw.
    const replace = pushed.current;
    pushed.current = true;
    startNavigation(() => (replace ? router.replace(link.current) : router.push(link.current)));
  }

  // The last click always wins, whichever part of the transition it lands in.
  function navigate(href: string) {
    const sheet = sheetRef.current;
    if (!sheet) return;

    if (phase.current === "covering") {
      aim(href);
      return;
    }
    if (phase.current === "waiting" || phase.current === "settling") {
      aim(href);
      go();
      return;
    }
    if (phase.current === "revealing") {
      const path = new URL(href, window.location.href).pathname;
      queued.current = path === target.current ? null : href;
      return;
    }

    aim(href);
    phase.current = "covering";
    getLenis()?.stop();
    gsap.set(sheet, { display: "block" });
    motion.current = prefersReducedMotion()
      ? gsap.fromTo(
          sheet,
          { opacity: 0, yPercent: 0 },
          { opacity: 1, duration: FADE_SECONDS, ease: "power1.out", onComplete: go },
        )
      : gsap.fromTo(
          sheet,
          { opacity: 1, yPercent: 100 },
          { yPercent: 0, duration: COVER_SECONDS, ease: "power2.inOut", onComplete: go },
        );
  }

  // Back and Forward never wait for the sheet; one already in progress is dropped.
  useEffect(() => {
    const onPopState = () => {
      fromHistory.current = true;
      if (phase.current !== "idle") end();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [end]);

  useEffect(() => {
    if (phase.current === "waiting" && pathname === target.current && !navigating) {
      settle();
      return;
    }
    if (!fromHistory.current || phase.current !== "idle") return;
    fromHistory.current = false;
    if (pathname === "/") markPreloaderSeen();
    const main = visibleMain();
    if (main) gsap.fromTo(main, { opacity: 0 }, { opacity: 1, duration: FADE_SECONDS, ease: "power1.out", clearProps: "opacity" });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });

  return (
    <PageTransitionContext.Provider value={{ navigate, isBusy: () => phase.current !== "idle" }}>
      {children}
      <div ref={sheetRef} aria-hidden="true" className="page-sheet">
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="sheet-wide" clipPathUnits="objectBoundingBox">
              <path transform={`scale(${1 / TORN_WIDTH} ${1 / SHEET_WIDE_H})`} d={SHEET_WIDE_PATH} />
            </clipPath>
            <clipPath id="sheet-tall" clipPathUnits="objectBoundingBox">
              <path transform={`scale(${1 / TORN_WIDTH} ${1 / SHEET_TALL_H})`} d={SHEET_TALL_PATH} />
            </clipPath>
          </defs>
        </svg>
        <div className="page-sheet-paper paper-fibre flex items-center justify-center bg-paper px-4">
          <p
            ref={nameRef}
            className="text-center font-heading text-[clamp(2.25rem,8vw,7rem)] leading-none font-bold tracking-tight text-ink-green uppercase"
          />
          <Grain surface="colour" />
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
}
