"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { scrollToLink } from "@/components/PageTransition";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Act = { id: string; number: string; label: string };

// Fixed, not sticky, so it can stay hidden over the Opening and appear only once Act 1 is at the top.
// Under the transition sheet (70) and the cursor (80).
export default function ActNavigator({ acts }: { acts: Act[] }) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const sections = acts.flatMap(({ id }) => document.getElementById(id) ?? []);
    if (!sections.length) return;
    ScrollTrigger.create({
      trigger: sections[0],
      endTrigger: sections.at(-1),
      start: "top 2px",
      end: "bottom top",
      onToggle: (self) => {
        setVisible(self.isActive);
        if (!self.isActive) setOpen(false);
      },
    });
    sections.forEach((section, i) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive) setCurrent(i);
        },
      });
    });
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const jump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpen(false);
    scrollToLink(`#${id}`);
    window.history.replaceState(window.history.state, "", `#${id}`);
    document.getElementById(`${id}-title`)?.focus({ preventScroll: true });
  };

  const { number, label } = acts[current];

  return (
    <nav
      ref={rootRef}
      aria-label="Acts"
      className={`fixed inset-x-0 top-0 z-30 border-b border-ink-green/10 bg-paper-white font-ui text-xs tracking-wide transition-[opacity,visibility] duration-300 ease-out motion-reduce:transition-none md:text-sm ${
        visible ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="act-list"
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-full items-center justify-between px-4 text-ink-green md:hidden"
      >
        <span>
          {number} {label}
        </span>
        <span aria-hidden="true">{open ? "×" : "+"}</span>
      </button>

      <ul
        id="act-list"
        className={`${open ? "block" : "hidden"} absolute inset-x-0 top-full border-b border-ink-green/10 bg-paper-white pb-2 md:static md:flex md:h-10 md:items-center md:justify-center md:gap-3 md:border-0 md:bg-transparent md:pb-0`}
      >
        {acts.map((act, i) => (
          <li key={act.id} className="md:flex md:items-center md:gap-3">
            {i > 0 && (
              <span aria-hidden="true" className="hidden text-ink-green/40 md:inline">
                ·
              </span>
            )}
            <a
              href={`#${act.id}`}
              aria-current={i === current ? "location" : undefined}
              onClick={(event) => jump(event, act.id)}
              className={`block px-4 py-2.5 underline-offset-4 hover:underline md:inline md:p-0 ${
                i === current ? "text-ink-green" : "text-ink-green/60"
              }`}
            >
              {act.number} {act.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
