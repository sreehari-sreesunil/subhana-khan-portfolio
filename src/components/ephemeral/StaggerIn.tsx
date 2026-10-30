"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type StaggerInProps = {
  children: ReactNode;
  step?: number;
  duration?: number;
  /** Each item waits until it's on screen itself, so tall stacks don't finish out of sight. */
  oneByOne?: boolean;
};

// Fades its [data-stagger] children up one after another, once. Reduced motion: fades only.
export default function StaggerIn({ children, step = 0.09, duration = 0.6, oneByOne }: StaggerInProps) {
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
          const y = context.conditions?.reduce ? 0 : 10;
          const show = { opacity: 1, y: 0, duration, ease: "power2.out", stagger: step };
          if (oneByOne) {
            gsap.set(items, { opacity: 0, y });
            ScrollTrigger.batch(items, {
              start: "top 80%",
              once: true,
              onEnter: (batch) => gsap.to(batch, show),
            });
            return;
          }
          gsap.fromTo(items, { opacity: 0, y }, {
            ...show,
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
