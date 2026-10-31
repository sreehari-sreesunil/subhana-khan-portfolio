"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SheetBlock from "./SheetBlock";
import type { SheetImage } from "./Drawing";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// After every other reveal group on the sheet.
const LAST_GROUP = 99;

type InhabitantProps = {
  image: SheetImage;
  at: string;
  phone?: string;
  /** Short walk tied to scrolling on desktop, in percent of the figure's own width. Ends where it stands. */
  walk?: number;
};

/** One of her cover cutouts, standing in a free cell. Decorative: she's in the cover's own alt text. */
export default function Inhabitant({ image, at, phone = "span 1", walk }: InhabitantProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const figure = rootRef.current;
      // The tall wrapper where there is one: a stuck sheet has no scroll distance of its own.
      const sheet = figure?.closest<HTMLElement>(".sheet-hold") ?? figure?.closest<HTMLElement>(".sheet");
      if (!walk || !figure || !sheet) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          figure,
          { xPercent: walk },
          { xPercent: 0, ease: "none", scrollTrigger: { trigger: sheet, start: "top 60%", end: "bottom bottom", scrub: 1 } },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <SheetBlock at={at} phone={phone} className="sheet-drawing sheet-standing">
      <div ref={rootRef} className="sheet-fit" style={{ "--sheet-ratio": image.width / image.height } as CSSProperties}>
        <div data-sheet-step="people" data-sheet-group={LAST_GROUP}>
          <Image src={image.src} alt="" width={image.width} height={image.height} sizes="15vw" className="block h-auto w-full" />
        </div>
      </div>
    </SheetBlock>
  );
}
