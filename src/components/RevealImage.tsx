"use client";

import Image from "next/image";
import { useRef, type ComponentProps } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealImageProps = ComponentProps<typeof Image> & { wrapperClassName?: string };

// The hidden start state lives in CSS under html.js, so the markup never depends on the browser.
export default function RevealImage({ wrapperClassName = "", className = "", alt, ...image }: RevealImageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Next keeps visited pages alive; coming back to one must not replay it.
  const revealed = useRef(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      const inner = root?.firstElementChild;
      if (!root || !inner) return;

      const finish = () => {
        revealed.current = true;
        gsap.set(root, { clipPath: "none", opacity: 1 });
      };
      if (revealed.current) {
        finish();
        return;
      }

      const mm = gsap.matchMedia();
      mm.add(
        { reduce: "(prefers-reduced-motion: reduce)", full: "(prefers-reduced-motion: no-preference)" },
        (context) => {
          const reduce = Boolean(context.conditions?.reduce);
          ScrollTrigger.create({
            trigger: root,
            start: "top 90%",
            once: true,
            onEnter: () => {
              if (reduce) {
                gsap.to(root, { opacity: 1, duration: 0.8, ease: "power2.out", onComplete: finish });
                return;
              }
              gsap.fromTo(
                root,
                { clipPath: "inset(100% 0% 0% 0%)" },
                { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.out", onComplete: finish },
              );
              gsap.fromTo(inner, { scale: 1.08 }, { scale: 1, duration: 1, ease: "power3.out" });
            },
          });
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} data-reveal className={`overflow-hidden ${wrapperClassName}`}>
      <div>
        <Image alt={alt} className={className} {...image} />
      </div>
    </div>
  );
}
