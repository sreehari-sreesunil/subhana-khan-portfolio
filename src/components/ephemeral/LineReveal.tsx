"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Fades a paragraph up line by line, once. Reduced motion: one plain fade.
export default function LineReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  // Next keeps visited pages alive; coming back to one must not replay it.
  const played = useRef(false);

  useGSAP(() => {
    const el = ref.current;
    if (!el || played.current) return;
    const scrollTrigger = { trigger: el, start: "top 85%", once: true };

    const mm = gsap.matchMedia();
    mm.add(
      { reduce: "(prefers-reduced-motion: reduce)", full: "(prefers-reduced-motion: no-preference)" },
      (context) => {
        if (context.conditions?.reduce) {
          gsap.from(el, {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger,
            onComplete: () => {
              played.current = true;
            },
          });
          return;
        }
        const split = SplitText.create(el, {
          type: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              opacity: 0,
              y: 8,
              duration: 1,
              ease: "power2.out",
              stagger: 0.14,
              scrollTrigger,
              // Back to plain text once it has played, so resizing never re-splits.
              onComplete: () => {
                played.current = true;
                split.revert();
                split.kill();
              },
            }),
        });
      },
    );
  });

  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}
