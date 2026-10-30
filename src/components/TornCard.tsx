"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { tornBodyPath } from "@/components/home/SpeechBubble";

// A paper card with a torn edge, redrawn at its real size so the tear never stretches.
export default function TornCard({ seed, className = "", children }: { seed: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    const tear = () => {
      const { offsetWidth: width, offsetHeight: height } = card;
      card.style.clipPath = `path("${tornBodyPath(seed, height, 8, width)}")`;
    };
    const observer = new ResizeObserver(tear);
    observer.observe(card);
    return () => observer.disconnect();
  }, [seed]);

  return (
    <article ref={ref} className={className}>
      {children}
    </article>
  );
}
