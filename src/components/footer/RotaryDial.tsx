"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import gsap from "gsap";
import { tornBodyPath } from "@/components/home/SpeechBubble";
import TransitionLink from "@/components/TransitionLink";
import { site } from "@/content/site";
import CopyEmail from "./CopyEmail";

const NUMBER = site.dial.number;
const CENTRE = 500;
const FINGER_STOP = 125; // degrees clockwise from 12 o'clock
const HOLE_STEP = 30;
const RING = 340;
const HOLE = 60;
const STOP_MARGIN = 14; // the finger meets the stop just before the hole reaches it
const REACHED = 12; // how close to the stop still counts as dialled
const OVERSHOOT = 4; // degrees the wheel swings past rest on its way back

const FACE_PATH = tornBodyPath(20261101, 1000, 486);
const WHEEL_PATH = tornBodyPath(20261102, 1000, 486);
const HUB_PATH = tornBodyPath(20261103, 1000, 486);
const CARD_PATH = tornBodyPath(20261104, 640, 18);

// As on a real dial: 1 sits nearest the stop and 0 furthest, so 0 is the longest pull.
const holes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit, i) => {
  const steps = i + 1;
  const angle = ((FINGER_STOP - HOLE_STEP * steps) * Math.PI) / 180;
  return {
    digit: String(digit),
    travel: HOLE_STEP * steps - STOP_MARGIN,
    x: +(CENTRE + RING * Math.sin(angle)).toFixed(2),
    y: +(CENTRE - RING * Math.cos(angle)).toFixed(2),
  };
});

type Status = "idle" | "wrong" | "connecting" | "connected";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pointerAngle = (x: number, y: number) => (Math.atan2(x, -y) * 180) / Math.PI;

export default function RotaryDial() {
  const { dial, footer } = site;
  const [entered, setEntered] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const dialRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);

  // Read inside animation callbacks, where state from the last render would be stale.
  const digits = useRef("");
  const busy = useRef(false);
  const pull = useRef<{ hole: (typeof holes)[number]; total: number; angle: number } | null>(null);
  const typed = useRef<string[]>([]);
  const typing = useRef(false);
  const pending = useRef<gsap.core.Tween | null>(null);

  useEffect(
    () => () => {
      pending.current?.kill();
      if (wheelRef.current) gsap.killTweensOf(wheelRef.current);
      if (dialRef.current) gsap.killTweensOf(dialRef.current);
    },
    [],
  );

  // Holes own their touches outright. touch-action alone isn't dependable on SVG shapes: the
  // browser takes the drag for a scroll and cancels it. This has to be a non-passive listener.
  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    const claim = (event: TouchEvent) => {
      if (event.target instanceof Element && event.target.hasAttribute("data-digit")) event.preventDefault();
    };
    wheel.addEventListener("touchstart", claim, { passive: false });
    return () => wheel.removeEventListener("touchstart", claim);
  }, []);

  // The card moves only once it's open, so it can't be reached while hidden.
  useEffect(() => {
    const card = cardRef.current;
    if (status !== "connected" || !card) return;
    const focusEmail = () => emailRef.current?.querySelector("a")?.focus({ preventScroll: true });
    if (prefersReducedMotion()) {
      focusEmail();
      return;
    }
    gsap.fromTo(card, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "power3.out", onComplete: focusEmail });
  }, [status]);

  const later = (seconds: number, run: () => void) => {
    pending.current?.kill();
    pending.current = gsap.delayedCall(seconds, run);
  };

  const reset = () => {
    digits.current = "";
    typed.current = [];
    busy.current = false;
    setEntered("");
    setStatus("idle");
  };

  const wrongNumber = () => {
    busy.current = true;
    typed.current = [];
    setStatus("wrong");
    if (prefersReducedMotion()) {
      digits.current = "";
      setEntered("");
      busy.current = false;
      return;
    }
    gsap.fromTo(
      dialRef.current,
      { x: 0 },
      { x: 6, duration: 0.07, repeat: 5, yoyo: true, ease: "sine.inOut", clearProps: "x" },
    );
    later(0.7, () => {
      digits.current = "";
      setEntered("");
      busy.current = false;
    });
  };

  const register = (digit: string) => {
    const next = digits.current + digit;
    digits.current = next;
    setEntered(next);
    if (!NUMBER.startsWith(next)) {
      wrongNumber();
      return;
    }
    setStatus((current) => (current === "wrong" ? "idle" : current));
    if (next !== NUMBER) return;
    busy.current = true;
    typed.current = [];
    setStatus("connecting");
    later(1, () => setStatus("connected"));
  };

  // Two steps, not an elastic ease: its swing grows with the pull (33° on a 0), and this one can't.
  const springBack = () => {
    const wheel = wheelRef.current;
    const from = Number(gsap.getProperty(wheel, "rotation")) || 0;
    const past = -Math.min(OVERSHOOT, from * 0.2);
    gsap
      .timeline()
      .to(wheel, { rotation: past, duration: 0.55, ease: "power2.out", overwrite: true })
      .to(wheel, { rotation: 0, duration: 0.35, ease: "sine.inOut" });
  };

  // Keyboard: each digit plays the same pull, one after another.
  const playTyped = () => {
    if (typing.current) return;
    const digit = typed.current.shift();
    const hole = holes.find((h) => h.digit === digit);
    if (!hole || busy.current) {
      typed.current = [];
      return;
    }
    if (prefersReducedMotion()) {
      register(hole.digit);
      playTyped();
      return;
    }
    typing.current = true;
    gsap.to(wheelRef.current, {
      rotation: hole.travel,
      duration: 0.2 + hole.travel / 700,
      ease: "power2.inOut",
      overwrite: true,
      onComplete: () => {
        register(hole.digit);
        springBack();
        gsap.delayedCall(0.3, () => {
          typing.current = false;
          playTyped();
        });
      },
    });
  };

  const onHoleDown = (event: PointerEvent<SVGCircleElement>, hole: (typeof holes)[number]) => {
    if (busy.current || typing.current || event.button !== 0) return;
    if (prefersReducedMotion()) {
      register(hole.digit);
      return;
    }
    const box = wheelRef.current?.parentElement?.getBoundingClientRect();
    if (!box) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    gsap.killTweensOf(wheelRef.current);
    const start = pointerAngle(event.clientX - box.left - box.width / 2, event.clientY - box.top - box.height / 2);
    const current = Number(gsap.getProperty(wheelRef.current, "rotation")) || 0;
    pull.current = { hole, total: Math.max(0, current), angle: start };
  };

  const onHoleMove = (event: PointerEvent<SVGCircleElement>) => {
    const box = wheelRef.current?.parentElement?.getBoundingClientRect();
    if (!pull.current || !box) return;
    const angle = pointerAngle(event.clientX - box.left - box.width / 2, event.clientY - box.top - box.height / 2);
    // Sliding the difference, so a pointer crossing 12 o'clock doesn't jump a full turn.
    const delta = ((angle - pull.current.angle + 540) % 360) - 180;
    pull.current.angle = angle;
    pull.current.total = Math.min(pull.current.hole.travel, Math.max(0, pull.current.total + delta));
    gsap.set(wheelRef.current, { rotation: pull.current.total });
  };

  const onHoleUp = () => {
    const current = pull.current;
    if (!current) return;
    pull.current = null;
    springBack();
    if (current.total >= current.hole.travel - REACHED) register(current.hole.digit);
  };

  const hangUp = () => {
    const card = cardRef.current;
    const done = () => {
      reset();
      dialRef.current?.focus({ preventScroll: true });
    };
    if (status === "connected" && card && !prefersReducedMotion()) {
      gsap.to(card, { yPercent: 110, duration: 0.45, ease: "power2.in", onComplete: done });
      return;
    }
    done();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      if (busy.current) return;
      typed.current.push(event.key);
      playTyped();
      return;
    }
    if (event.key === "Escape" && (digits.current || typed.current.length)) {
      typed.current = [];
      pending.current?.kill();
      reset();
      return;
    }
    // Enter with a partial number is a wrong number; there's nothing to submit otherwise.
    if (event.key === "Enter" && digits.current && !busy.current) wrongNumber();
  };

  const onCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") hangUp();
  };

  const caption = { idle: dial.prompt, wrong: dial.wrong, connecting: dial.connecting, connected: dial.connected }[status];
  const slots = NUMBER.split("").map((_, i) => entered[i] ?? "·");

  return (
    <section
      aria-label={dial.label}
      className="paper-fibre relative flex flex-col items-center justify-center overflow-hidden bg-about-blue px-4 pt-8 pb-6 md:flex-1 md:pt-[3svh] md:pb-[3svh]"
    >
      {/* The card opens over this block only, so the plain email below it always stays in view. */}
      <div className="relative flex w-full flex-col items-center">
        <p aria-live="polite" className="font-ui text-base tracking-wide text-ink-green md:text-lg">
          {caption}
        </p>

      <div
        ref={dialRef}
        role="group"
        tabIndex={0}
        aria-label={dial.dialLabel}
        onKeyDown={onKeyDown}
        className="relative mt-4 aspect-square w-[min(84vw,24rem)] rounded-full outline-offset-4 outline-ink-green select-none focus-visible:outline-2 md:mt-[2svh] md:w-[min(56svh,32rem)]"
      >
        <svg aria-hidden="true" viewBox="0 0 1000 1000" className="absolute inset-0 size-full overflow-visible">
          <path d={FACE_PATH} fill="var(--bubble-shadow)" transform="translate(-16 16)" />
          <path d={FACE_PATH} fill="var(--bubble-cream)" />
          <circle cx={CENTRE - 8} cy={CENTRE + 8} r="420" fill="var(--bubble-shadow)" opacity="0.45" />
          {holes.map((hole) => (
            <text
              key={hole.digit}
              x={hole.x}
              y={hole.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="66"
              className="fill-ink-green font-heading font-semibold"
            >
              {hole.digit}
            </text>
          ))}
        </svg>

        {/* The wheel is its own layer: turning it is a transform, not a redraw. */}
        <div ref={wheelRef} className="absolute inset-0 will-change-transform">
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 1000"
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
          >
            <defs>
              <mask id="dial-holes" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
                <rect width="1000" height="1000" fill="white" />
                {holes.map((hole) => (
                  <circle key={hole.digit} cx={hole.x} cy={hole.y} r={HOLE} fill="black" />
                ))}
              </mask>
            </defs>
            <g mask="url(#dial-holes)">
              <path d={WHEEL_PATH} fill="var(--paper-white)" transform="translate(70 70) scale(0.86)" />
            </g>
            {/* Only the holes take touches, so a swipe anywhere else still scrolls the page. */}
            {holes.map((hole) => (
              <circle
                key={hole.digit}
                data-digit={hole.digit}
                data-cursor="grow"
                cx={hole.x}
                cy={hole.y}
                r={HOLE + 16}
                fill="transparent"
                className="pointer-events-auto touch-none"
                onPointerDown={(event) => onHoleDown(event, hole)}
                onPointerMove={onHoleMove}
                onPointerUp={onHoleUp}
                onPointerCancel={onHoleUp}
              />
            ))}
          </svg>
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 1000 1000"
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
        >
          <rect
            x={CENTRE - 13}
            y="92"
            width="26"
            height="118"
            rx="6"
            fill="var(--ink-brown)"
            transform={`rotate(${FINGER_STOP} ${CENTRE} ${CENTRE})`}
          />
          <path d={HUB_PATH} fill="var(--bubble-cream)" transform="translate(305 305) scale(0.39)" />
        </svg>

        <p
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center gap-[0.3em] font-heading text-[clamp(1.1rem,5vw,1.6rem)] font-semibold text-ink-green tabular-nums md:text-[min(3.1svh,1.75rem)]"
        >
          {slots.map((slot, i) => (
            <span key={i}>{slot}</span>
          ))}
        </p>
      </div>

        <div
          ref={cardRef}
          inert={status !== "connected"}
          onKeyDown={onCardKeyDown}
          className={`dial-card absolute inset-x-0 bottom-0 z-10 mx-auto w-[min(94%,42rem)] bg-bubble-cream px-[8%] py-10 md:py-[6svh] ${
            status === "connected" ? "" : "invisible"
          }`}
        >
          <div ref={emailRef}>
            <CopyEmail />
          </div>
          <p className="mt-2 font-ui text-ink-green md:text-lg">{site.contact.location}</p>
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 font-ui text-sm tracking-wide text-accent-terracotta md:text-base">
            <nav aria-label={footer.navLabel} className="flex gap-x-6">
              {footer.links.map((link) => (
                <TransitionLink key={link.href} href={link.href} className="underline-offset-4 hover:underline">
                  {link.label}
                </TransitionLink>
              ))}
            </nav>
            <button type="button" onClick={hangUp} className="underline-offset-4 hover:underline">
              {dial.hangUp}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center font-ui text-ink-green md:mt-[2.5svh] md:text-lg">
        {dial.writeTo}{" "}
        <a href={`mailto:${site.contact.email}`} className="underline underline-offset-4">
          {site.contact.email}
        </a>
      </p>

      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="dial-card" clipPathUnits="objectBoundingBox">
            <path transform={`scale(${1 / 1000} ${1 / 640})`} d={CARD_PATH} />
          </clipPath>
        </defs>
      </svg>

    </section>
  );
}
