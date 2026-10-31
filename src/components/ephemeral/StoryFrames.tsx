import Image from "next/image";
import type { ReactNode } from "react";
import Grain from "@/components/Grain";
import TornCard from "@/components/TornCard";
import { act1 } from "@/content/ephemeral-ground";
import { ephemeralGroundPreview as home } from "@/content/home";
import { MAP_H, MAP_W } from "@/lib/ephemeral-geometry";

const MAP_RATIO = MAP_W / MAP_H;

// What the acts over the stage are made of: torn cards, and on phones the map frames that replace the stage.
export function Credit({ children }: { children: ReactNode }) {
  return <figcaption className="mt-1.5 font-ui text-[11px] leading-snug text-ink-green/70">{children}</figcaption>;
}

/** The map cropped to one camera stop, for phones and reduced motion. */
type StaticFrameProps = { focus: { x: number; y: number }; scale: number; ratio: number; alt: string; children?: ReactNode };

export function StaticFrame({ focus, scale, ratio, alt, children }: StaticFrameProps) {
  const width = (scale * 100 * MAP_RATIO) / ratio;
  return (
    <figure className="px-4 pt-8 md:mx-auto md:max-w-2xl md:motion-safe:hidden">
      <div className="relative overflow-hidden" style={{ aspectRatio: ratio }}>
        <div
          className="absolute"
          style={{
            width: `${width}%`,
            aspectRatio: MAP_RATIO,
            left: `${50 - (focus.x / MAP_W) * width}%`,
            top: `${50 - (focus.y / MAP_H) * scale * 100}%`,
          }}
        >
          <Image src={home.map.src} alt={alt} fill sizes="100vw" />
          {children}
        </div>
      </div>
      <Credit>{act1.coastlineCredit}</Credit>
    </figure>
  );
}

const gaps = {
  first: "md:motion-safe:pt-[22svh] md:motion-safe:pb-[45svh]",
  hold: "md:motion-safe:py-[28svh]",
  move: "md:motion-safe:py-[45svh]",
  end: "md:motion-safe:pb-[40svh]",
};

const widths = {
  wide: "md:mx-auto md:max-w-5xl md:motion-safe:mx-0 md:motion-safe:w-[70vw] md:motion-safe:max-w-none lg:motion-safe:w-[62vw]",
  regular: "md:mx-auto md:max-w-2xl md:motion-safe:mx-0 md:motion-safe:w-[max(34vw,20rem)] md:motion-safe:max-w-[32rem]",
  // Leaves room for the map card on the stage.
  slim: "md:mx-auto md:max-w-2xl md:motion-safe:mx-0 md:motion-safe:w-[max(21vw,17rem)]",
};

type CardProps = { id: string; seed: number; wide?: boolean; slim?: boolean; left?: boolean; gap?: keyof typeof gaps; children: ReactNode };


export function Card({ id, seed, wide, slim, left, gap = "hold", children }: CardProps) {
  return (
    <div
      id={id}
      className={`relative px-4 py-3 md:motion-safe:flex ${left ? "md:motion-safe:pl-[3vw]" : "md:motion-safe:justify-end md:motion-safe:pr-[3vw]"} ${gaps[gap]}`}
    >
      {/* The shadow sits on a wrapper: clip-path would cut it off the card itself. */}
      <div
        data-act-card
        className={`drop-shadow-[-6px_8px_6px_rgba(34,48,42,0.28)] ${wide ? widths.wide : slim ? widths.slim : widths.regular}`}
      >
        <TornCard seed={seed} className="paper-fibre relative bg-paper px-7 py-9 md:px-10 md:py-11">
          {children}
          <Grain surface="colour" />
        </TornCard>
      </div>
    </div>
  );
}
