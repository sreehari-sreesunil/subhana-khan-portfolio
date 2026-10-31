"use client";

import Image from "next/image";
import { useRef, type ComponentProps } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { fetchEarly } from "@/lib/fetch-early";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// However a trigger gets missed, an image on screen must never stay hidden.
const FAILSAFE_MS = 2000;

/** A wipe over an empty box shows nothing, so on a slow connection wait for the image, but not for long. */
function whenLoaded(image: HTMLImageElement | null, run: () => void) {
  if (!image || image.complete) {
    run();
    return;
  }
  const once = { once: true };
  const go = () => {
    clearTimeout(timeout);
    image.removeEventListener("load", go);
    image.removeEventListener("error", go);
    run();
  };
  const timeout = setTimeout(go, FAILSAFE_MS);
  image.addEventListener("load", go, once);
  image.addEventListener("error", go, once);
}

type RevealImageProps = ComponentProps<typeof Image> & {
  wrapperClassName?: string;
  /** Seconds. */
  duration?: number;
  /** When the wipe starts, as a ScrollTrigger start. */
  start?: string;
};

// The hidden start state lives in CSS under html.js, so the markup never depends on the browser.
export default function RevealImage({
  wrapperClassName = "",
  className = "",
  alt,
  duration = 1,
  start = "top 90%",
  ...image
}: RevealImageProps) {
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

      fetchEarly(root);

      const mm = gsap.matchMedia();
      mm.add(
        { reduce: "(prefers-reduced-motion: reduce)", full: "(prefers-reduced-motion: no-preference)" },
        (context) => {
          const reduce = Boolean(context.conditions?.reduce);
          let played = false;
          let failsafe: ReturnType<typeof setTimeout> | undefined;

          const play = () => {
            if (played) return;
            played = true;
            clearTimeout(failsafe);
            observer.disconnect();
            whenLoaded(root.querySelector("img"), () => {
              if (reduce) {
                gsap.to(root, { opacity: 1, duration: 0.8, ease: "power2.out", onComplete: finish });
                return;
              }
              gsap.fromTo(
                root,
                { clipPath: "inset(100% 0% 0% 0%)" },
                { clipPath: "inset(0% 0% 0% 0%)", duration, ease: "power3.out", onComplete: finish },
              );
              gsap.fromTo(inner, { scale: 1.08 }, { scale: 1, duration, ease: "power3.out" });
            });
          };

          const observer = new IntersectionObserver(([entry]) => {
            clearTimeout(failsafe);
            if (entry.isIntersecting) failsafe = setTimeout(play, FAILSAFE_MS);
          });
          observer.observe(root);
          ScrollTrigger.create({ trigger: root, start, once: true, onEnter: play });

          return () => {
            clearTimeout(failsafe);
            observer.disconnect();
          };
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
