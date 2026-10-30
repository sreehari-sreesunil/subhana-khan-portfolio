"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { site } from "@/content/site";

// The dot is a full-size circle scaled down, so growing it only ever animates transform.
const SIZE = 72;
const DOT = 8 / SIZE;

type CursorState = "dot" | "link" | "enter" | "hidden";

const scales: Record<CursorState, number> = { dot: DOT, link: DOT * 1.6, enter: 1, hidden: 0 };

function stateFor(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return "dot";
  // Text fields keep the native cursor, so the dot steps aside.
  if (target.closest("input, textarea, select, [contenteditable='true']")) return "hidden";
  if (target.closest("[data-cursor='enter']")) return "enter";
  if (target.closest("a, button, [role='button'], summary, label")) return "link";
  return "dot";
}

// Rendered for everyone; CSS shows it only once a mouse has moved, and only here.
export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!root || !dot || !label) return;
    const html = document.documentElement;

    const mm = gsap.matchMedia();
    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const moveX = gsap.quickTo(root, "x", { duration: 0.15, ease: "power3" });
      const moveY = gsap.quickTo(root, "y", { duration: 0.15, ease: "power3" });
      let started = false;
      let pointerState: CursorState = "dot";
      let inWindow = true;

      const show = () => {
        const state = inWindow ? pointerState : "hidden";
        gsap.to(dot, { scale: scales[state], duration: 0.25, ease: "power2.out", overwrite: "auto" });
        gsap.to(label, { opacity: state === "enter" ? 1 : 0, duration: 0.15, ease: "power2.out", overwrite: "auto" });
      };

      gsap.set(dot, { scale: 0 });

      const onMove = (event: PointerEvent) => {
        // A laptop with a touchscreen reports a fine pointer; a finger still isn't a mouse.
        if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
        if (!started) {
          started = true;
          html.classList.add("has-cursor");
          moveX(event.clientX, event.clientX);
          moveY(event.clientY, event.clientY);
          pointerState = stateFor(event.target);
          show();
          return;
        }
        moveX(event.clientX);
        moveY(event.clientY);
      };
      const onOver = (event: PointerEvent) => {
        const next = stateFor(event.target);
        if (next === pointerState) return;
        pointerState = next;
        show();
      };
      const onLeave = () => {
        inWindow = false;
        show();
      };
      const onEnter = () => {
        inWindow = true;
        show();
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      html.addEventListener("mouseleave", onLeave);
      html.addEventListener("mouseenter", onEnter);

      return () => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        html.removeEventListener("mouseleave", onLeave);
        html.removeEventListener("mouseenter", onEnter);
        html.classList.remove("has-cursor");
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="cursor">
      <div ref={dotRef} className="cursor-dot" style={{ width: SIZE, height: SIZE }}>
        <span ref={labelRef} className="cursor-label font-ui text-xs tracking-wide text-paper-white">
          {site.cursorEnterLabel}
        </span>
      </div>
    </div>
  );
}
