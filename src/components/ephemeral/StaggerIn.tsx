"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Fades its [data-stagger] children up one after another, once. Reduced motion: fades only.
export default function StaggerIn({ children, step = 0.09 }: { children: ReactNode; step?: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Next keeps visited pages alive; coming back to one must not replay it.
  const played = useRef(false);

  useGSAP(
    () => {
      if (played.current) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-stagger]", rootRef.current);
      const mm = gsap.matchMedia();
      mm.add(
        { reduce: "(prefers-reduced-motion: reduce)", full: "(prefers-reduced-motion: no-preference)" },
        (context) => {
          gsap.from(items, {
            opacity: 0,
            y: context.conditions?.reduce ? 0 : 10,
            duration: 0.6,
            ease: "power2.out",
            stagger: step,
            scrollTrigger: { trigger: rootRef.current, start: "top 85%", once: true },
            onComplete: () => {
              played.current = true;
            },
          });
        },
      );
    },
    { scope: rootRef },
  );

  return <div ref={rootRef}>{children}</div>;
}
