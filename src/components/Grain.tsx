"use client";

import { useEffect, useRef } from "react";

// Moving film grain for one section, above its images. The section must be `relative`.
// `colour`: soft-light, for coloured sections. `white`: multiply, for pure white sections.
export default function Grain({ surface }: { surface: "colour" | "white" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      el.classList.toggle("grain-paused", !entry.isIntersecting);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={`grain grain-${surface}`}>
      <div />
    </div>
  );
}
