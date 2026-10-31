"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Grain from "@/components/Grain";
import { fetchEarly } from "@/lib/fetch-early";
import SheetBlock from "./SheetBlock";
import SheetFrame from "./SheetFrame";
import TitleBlock, { type TitleBlockProps } from "./TitleBlock";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const FAILSAFE_MS = 2000;

// A whole reveal, however much is on the sheet. Slowness comes from the order, not the duration.
const SHEET_SECONDS = { slow: 3, regular: 2 };
// Phones reveal one group at a time, as it arrives.
const GROUP_SECONDS = { slow: 2, regular: 1.2 };

type SheetGridProps = {
  id?: string;
  title: TitleBlockProps;
  /** Cells kept for the title block. */
  titleAt?: string;
  /** Act 2's pace: long steps, text line by line. */
  slow?: boolean;
  /** Stays on screen while the reader scrolls on, so a slow reveal can finish. Desktop with motion only. */
  hold?: boolean;
  children: ReactNode;
};

const steps = (root: HTMLElement, step: string, group: number) =>
  gsap.utils.toArray<HTMLElement>(`[data-sheet-step="${step}"][data-sheet-group="${group}"]`, root);

function fit(timeline: gsap.core.Timeline, seconds: number) {
  if (timeline.duration() > seconds) timeline.timeScale(timeline.duration() / seconds);
  return timeline;
}

/** Drawing → callout → text → people. */
function groupTimeline(root: HTMLElement, group: number, slow: boolean, reduce: boolean) {
  const duration = slow ? 1.4 : 0.7;
  const short = slow ? 0.8 : 0.4;
  const ease = "power2.out";
  const timeline = gsap.timeline();
  // Only once something is on the timeline: a negative start would render straight away.
  const after = () => (timeline.duration() ? (slow ? ">-0.6" : ">-0.3") : 0);

  const drawing = steps(root, "drawing", group);
  if (drawing.length) {
    if (reduce) timeline.to(drawing, { opacity: 1, duration, ease });
    else
      timeline.fromTo(
        drawing,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration, ease: "power3.out" },
      );
  }

  steps(root, "callout", group).forEach((element, i) => {
    timeline.to(element, { opacity: 1, duration: short, ease }, i === 0 ? after() : ">-0.2");
    const line = element.querySelector("path");
    if (line && !reduce) {
      timeline.fromTo(line, { attr: { "stroke-dashoffset": 1 } }, { attr: { "stroke-dashoffset": 0 }, duration: short, ease }, "<");
    }
  });

  steps(root, "text", group).forEach((element, i) => {
    const position = i === 0 ? after() : ">-0.5";
    if (slow && !reduce && element.hasAttribute("data-sheet-lines")) {
      const split = SplitText.create(element, { type: "lines" });
      gsap.set(element, { opacity: 1 });
      gsap.set(split.lines, { opacity: 0, y: 8 });
      timeline.to(split.lines, { opacity: 1, y: 0, duration, ease, stagger: 0.3, onComplete: () => split.revert() }, position);
      return;
    }
    timeline.fromTo(element, { opacity: 0, y: reduce ? 0 : 8 }, { opacity: 1, y: 0, duration: slow ? duration : 0.6, ease }, position);
  });

  const people = steps(root, "people", group);
  if (people.length) timeline.to(people, { opacity: 1, duration, ease }, after());
  return timeline;
}

function showGroup(root: HTMLElement, group: number) {
  const everything = gsap.utils.toArray<HTMLElement>(`[data-sheet-step][data-sheet-group="${group}"]`, root);
  gsap.set(everything, { clipPath: "none", opacity: 1 });
  everything.forEach((element) => {
    const line = element.querySelector("path");
    if (line) line.setAttribute("stroke-dashoffset", "0");
  });
}

// However a trigger gets missed, a sheet on screen must never stay hidden.
function arm(trigger: HTMLElement, start: string, run: () => void) {
  let done = false;
  let failsafe: ReturnType<typeof setTimeout> | undefined;
  const play = () => {
    if (done) return;
    done = true;
    clearTimeout(failsafe);
    observer.disconnect();
    run();
  };
  const observer = new IntersectionObserver(([entry]) => {
    clearTimeout(failsafe);
    if (entry.isIntersecting) failsafe = setTimeout(play, FAILSAFE_MS);
  });
  observer.observe(trigger);
  ScrollTrigger.create({ trigger, start, once: true, onEnter: play });
  return () => {
    clearTimeout(failsafe);
    observer.disconnect();
  };
}

// Cuts every stage-window out of the paper, so its texture stays whole around them.
function cutWindows(sheet: HTMLElement, paper: HTMLElement, windows: HTMLElement[]) {
  const box = sheet.getBoundingClientRect();
  const holes = windows.map((element) => {
    const rect = element.getBoundingClientRect();
    const [l, t, r, b] = [rect.left - box.left, rect.top - box.top, rect.right - box.left, rect.bottom - box.top];
    return `${l}px ${t}px, ${r}px ${t}px, ${r}px ${b}px, ${l}px ${b}px, ${l}px ${t}px, 0 0`;
  });
  paper.style.clipPath = `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${holes.join(", ")})`;
}

export default function SheetGrid({ id, title, titleAt = "K8:L8", slow = false, hold = false, children }: SheetGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Next keeps visited pages alive; coming back to one must not replay it.
  const played = useRef(new Set<number>());

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const groups = [
        ...new Set(gsap.utils.toArray<HTMLElement>("[data-sheet-group]", root).map((element) => Number(element.dataset.sheetGroup))),
      ].sort((a, b) => a - b);

      fetchEarly(root, '[data-sheet-step="drawing"] img');

      const mm = gsap.matchMedia();
      mm.add(
        { reduce: "(prefers-reduced-motion: reduce)", wide: "(min-width: 64rem)", all: "all" },
        (context) => {
          const reduce = Boolean(context.conditions?.reduce);
          played.current.forEach((group) => showGroup(root, group));
          const waiting = groups.filter((group) => !played.current.has(group));
          if (!waiting.length) return;

          const finish = (group: number) => {
            played.current.add(group);
            showGroup(root, group);
          };

          const disarm = context.conditions?.wide
            ? [
                arm(root, "top 55%", () => {
                  const sheet = gsap.timeline();
                  waiting.forEach((group, i) => {
                    // The next drawing starts while this one is still arriving; people come last.
                    const position = i === 0 ? 0 : steps(root, "drawing", group).length ? (slow ? "<+=1" : "<+=0.4") : ">-0.2";
                    sheet.add(groupTimeline(root, group, slow, reduce).eventCallback("onComplete", () => finish(group)), position);
                  });
                  fit(sheet, slow ? SHEET_SECONDS.slow : SHEET_SECONDS.regular);
                }),
              ]
            : // On a phone the sheet is many screens tall: each group waits until it arrives.
              waiting.flatMap((group) => {
                const first = root.querySelector<HTMLElement>(`[data-sheet-group="${group}"]`);
                if (!first) return [];
                return [
                  arm(first, "top 80%", () => {
                    fit(groupTimeline(root, group, slow, reduce), slow ? GROUP_SECONDS.slow : GROUP_SECONDS.regular).eventCallback("onComplete", () => finish(group));
                  }),
                ];
              });
          return () => disarm.forEach((stop) => stop());
        },
      );

      const windows = gsap.utils.toArray<HTMLElement>("[data-stage-window]", root);
      const paper = root.querySelector<HTMLElement>("[data-sheet-paper]");
      const sheet = paper?.parentElement;
      if (windows.length && paper && sheet) {
        mm.add("(min-width: 48rem) and (prefers-reduced-motion: no-preference)", () => {
          const observer = new ResizeObserver(() => cutWindows(sheet, paper, windows));
          observer.observe(sheet);
          return () => {
            observer.disconnect();
            paper.style.clipPath = "";
          };
        });
      }
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} id={id} className={`relative ${hold ? "sheet-hold" : ""}`}>
      <div className="sheet">
        <div data-sheet-paper className="sheet-paper paper-fibre bg-paper" />
        <SheetFrame />
        <div className="sheet-cells">
          {children}
          <SheetBlock at={titleAt}>
            <TitleBlock {...title} />
          </SheetBlock>
        </div>
        <Grain surface="colour" />
      </div>
    </div>
  );
}
