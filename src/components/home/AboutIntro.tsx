"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import type { AboutIntroContent } from "@/content/home";
import Grain from "@/components/Grain";
import SiteHeader from "@/components/SiteHeader";
import SpeechBubble from "./SpeechBubble";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type AboutIntroProps = {
  content: AboutIntroContent;
  headingLevel?: "h1" | "h2";
  /** For the top of a page, where the entrance would flash the text before hiding it. */
  static?: boolean;
};

export default function AboutIntro({ content: about, headingLevel: Heading = "h2", static: isStatic }: AboutIntroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Plays once as the section comes into view: portrait rises, the bubble opens from its tail,
  // then the text appears line by line, slowly. Reduced motion: the same order as plain fades.
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || isStatic) return;
      const portrait = section.querySelector<HTMLElement>("[data-about-portrait]");
      const bubble = section.querySelector<HTMLElement>("[data-about-bubble]");
      const tail = section.querySelector<SVGElement>("[data-bubble-tail]");
      const text = gsap.utils.toArray<HTMLElement>("[data-about-text]", section);
      // The link fades in whole: splitting it would hide it from screen readers.
      const link = section.querySelector<HTMLElement>("[data-about-link]");
      if (!portrait || !bubble || !tail || !link) return;

      const mm = gsap.matchMedia();
      mm.add(
        { reduce: "(prefers-reduced-motion: reduce)", full: "(prefers-reduced-motion: no-preference)" },
        (context) => {
          const reduce = Boolean(context.conditions?.reduce);
          const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
          let split: SplitText | undefined;

          if (reduce) {
            tl.from(portrait, { opacity: 0, duration: 0.8 })
              .from(bubble, { opacity: 0, duration: 0.8 }, "-=0.3")
              .from([...text, link], { opacity: 0, duration: 1.2, stagger: 0.25 }, "-=0.2");
          } else {
            tl.from(portrait, { opacity: 0, y: 40, duration: 1 })
              .from(bubble, { opacity: 0, scale: 0.9, duration: 0.8 }, "-=0.35")
              .addLabel("lines", "-=0.2");
            split = SplitText.create(text, {
              type: "lines",
              autoSplit: true,
              onSplit: (self) => {
                const reveal = gsap
                  .timeline({ defaults: { ease: "power2.out", duration: 1.4 } })
                  .from(self.lines, { opacity: 0, y: 8, stagger: 0.25 })
                  .from(link, { opacity: 0, y: 8 }, "-=1.15");
                tl.add(reveal, "lines");
                return reveal;
              },
            });
            // Back to plain text once it has played, so resizing never re-splits.
            tl.eventCallback("onComplete", () => {
              split?.revert();
              split?.kill();
            });
          }

          // Measured at play time (final layout); offsets are divided by the current scale.
          const openFromTail = () => {
            const scale = Number(gsap.getProperty(bubble, "scaleX")) || 1;
            const b = bubble.getBoundingClientRect();
            const t = tail.getBoundingClientRect();
            gsap.set(bubble, {
              transformOrigin: `${(t.left - b.left) / scale}px ${(t.bottom - b.top) / scale}px`,
            });
          };

          ScrollTrigger.create({
            trigger: section,
            start: "top 65%",
            once: true,
            onEnter: () => {
              if (!reduce) openFromTail();
              tl.play();
            },
          });
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-heading"
      data-screen={isStatic ? "" : undefined}
      className={`paper-fibre relative flex flex-col overflow-hidden bg-about-blue px-4 pt-20 md:min-h-svh md:justify-center md:px-10 md:py-28 ${isStatic ? "about-screen" : ""}`}
    >
      <SiteHeader variant="light" />

      <div data-about-bubble className="w-full md:ml-[23%] md:w-[58%] md:max-w-[56rem]">
        <SpeechBubble tall={isStatic}>
          <div className="px-[7%] pt-[8%] pb-[9%] md:px-[7%] md:pt-[6%] md:pb-[7%]">
            <Heading
              id="about-heading"
              data-about-text
              className="font-heading text-[clamp(1.75rem,2.8vw,2.75rem)] leading-tight font-semibold text-ink-green"
            >
              {about.heading}
            </Heading>
            {about.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                data-about-text
                className="mt-[1.1em] text-center font-body text-[clamp(1rem,1.25vw,1.2rem)] leading-[1.45] text-ink-green"
              >
                {paragraph}
              </p>
            ))}
            {about.link && (
              <p data-about-link className="mt-6 text-center">
                <Link
                  href={about.link.href}
                  className="font-ui text-sm tracking-wide text-accent-terracotta underline-offset-4 hover:underline md:text-base"
                >
                  {about.link.label} <span aria-hidden="true">→</span>
                </Link>
              </p>
            )}
          </div>
        </SpeechBubble>
      </div>

      {/* TEMP portrait: cut out of the PDF page; see "Before launch" in CLAUDE.md. */}
      <div
        data-about-portrait
        className="relative -ml-4 mt-16 w-[45vw] md:absolute md:bottom-0 md:left-0 md:m-0 md:h-[52%] md:w-auto"
      >
        <Image
          src={about.portrait.src}
          alt={about.portraitAlt}
          width={about.portrait.width}
          height={about.portrait.height}
          sizes="(max-width: 768px) 45vw, 30vw"
          loading={isStatic ? "eager" : "lazy"}
          className="block h-auto w-full md:h-full md:w-auto"
        />
      </div>
      <Grain surface="colour" />
    </section>
  );
}
