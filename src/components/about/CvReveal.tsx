"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Each block fades up once as it enters view; its rows follow one after another.
// Reduced motion: the same order as plain fades. The hidden state is set after hydration.
export default function CvReveal({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const blocks = gsap.utils.toArray<HTMLElement>("[data-cv-block]", rootRef.current);
      const rows = gsap.utils.toArray<HTMLElement>("[data-cv-row]", rootRef.current);

      const mm = gsap.matchMedia();
      mm.add(
        { reduce: "(prefers-reduced-motion: reduce)", full: "(prefers-reduced-motion: no-preference)" },
        (context) => {
          const reduce = Boolean(context.conditions?.reduce);
          gsap.set(blocks, { opacity: 0, y: reduce ? 0 : 16 });
          gsap.set(rows, { opacity: 0, y: reduce ? 0 : 8 });

          ScrollTrigger.batch(blocks, {
            start: "top 88%",
            once: true,
            onEnter: (batch) => {
              gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.1 });
              batch.forEach((block, i) => {
                const blockRows = block.querySelectorAll("[data-cv-row]");
                if (!blockRows.length) return;
                gsap.to(blockRows, {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: "power2.out",
                  stagger: 0.06,
                  delay: 0.2 + i * 0.1,
                });
              });
            },
          });
        },
      );
    },
    { scope: rootRef },
  );

  return <div ref={rootRef}>{children}</div>;
}
