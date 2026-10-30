"use client";

import { useEffect } from "react";
import gsap from "gsap";
import Snap from "lenis/snap";
import { getLenis } from "@/components/SmoothScroll";

// Turns [data-screen] sections like pages: a gesture goes to the next one in its direction.
export default function ScreenSnap() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const lenis = getLenis();
      if (!lenis) return;
      const snap = new Snap(lenis, {
        type: "lock",
        // Lock only moves within this distance; the whole screen means every gesture qualifies.
        distanceThreshold: "100%",
        debounce: 120,
        duration: 0.9,
        easing: (t) => 1 - (1 - t) ** 3,
      });
      snap.addElements(gsap.utils.toArray<HTMLElement>("[data-screen]"), { align: ["start"] });

      // Keys scroll natively, which Snap never sees, and would stop between the screens.
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select")) return;
        const down = ["ArrowDown", "PageDown", "End"].includes(event.key) || (event.key === " " && !event.shiftKey);
        const up = ["ArrowUp", "PageUp", "Home"].includes(event.key) || (event.key === " " && event.shiftKey);
        if (!down && !up) return;
        event.preventDefault();
        if (down) snap.next();
        else snap.previous();
      };
      window.addEventListener("keydown", onKeyDown);

      return () => {
        window.removeEventListener("keydown", onKeyDown);
        snap.destroy();
      };
    });
    return () => mm.revert();
  }, []);

  return null;
}
