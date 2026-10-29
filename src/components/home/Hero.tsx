"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { hero, type HeroTile, type PlaceholderTone } from "@/content/home";
import PlaceholderFigure from "./PlaceholderFigure";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const toneClass: Record<PlaceholderTone, string> = {
  sand: "bg-sand",
  sage: "bg-sage/70",
  paper: "bg-paper",
  teal: "bg-thesis-teal/40",
};

const ease = [0.22, 1, 0.36, 1] as const;
const tileStagger = 0.07;

const lastRow = Math.max(...hero.tiles.map((t) => t.row + t.rowSpan - 1));

const overhangCells = Math.max(
  0,
  ...hero.figures.map((figure) => {
    const anchor = hero.tiles.find((t) => t.id === figure.anchorTileId);
    if (!anchor || anchor.row + anchor.rowSpan - 1 !== lastRow) return 0;
    return (-figure.bottom / 100) * anchor.rowSpan;
  }),
);

function gridArea(tile: HeroTile) {
  return {
    gridColumn: `${tile.col} / span ${tile.colSpan}`,
    gridRow: `${tile.row} / span ${tile.rowSpan}`,
  };
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const rise = reduceMotion ? 0 : 16;
  const afterTiles = hero.tiles.length * tileStagger;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      section.querySelectorAll<HTMLElement>("[data-parallax-speed]").forEach((el) => {
        gsap.to(el, {
          y: -Number(el.dataset.parallaxSpeed) * 100,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="hero relative overflow-x-clip bg-white px-4 md:px-10"
    >
      <div
        className="hero-comp"
        style={{ "--overhang": overhangCells } as React.CSSProperties}
      >
      <div className="hero-grid grid w-full grid-cols-4">
        {hero.tiles.map((tile, i) => {
          const isSingle = tile.colSpan === 1 && tile.rowSpan === 1;
          const span = Math.max(tile.colSpan, tile.rowSpan);
          return (
            <motion.div
              key={tile.id}
              style={gridArea(tile)}
              className={`relative overflow-hidden ${isSingle ? "aspect-square md:aspect-auto" : ""} ${
                tile.image ? "" : toneClass[tile.placeholderTone]
              }`}
              initial={{ opacity: 0, y: rise }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: i * tileStagger }}
            >
              {tile.image ? (
                <Image
                  src={tile.image.src}
                  alt={tile.alt}
                  fill
                  sizes={`(max-width: 768px) ${25 * span}vw, ${15 * span}vw`}
                  loading={tile.row === 1 ? "eager" : "lazy"}
                  className="object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 left-2 font-ui text-[10px] text-ink-green/50"
                >
                  {tile.id}
                </span>
              )}
            </motion.div>
          );
        })}

        {hero.figures.map((figure) => {
          const anchor = hero.tiles.find((t) => t.id === figure.anchorTileId);
          if (!anchor) return null;
          return (
            <div
              key={figure.id}
              style={gridArea(anchor)}
              className="pointer-events-none relative z-20"
            >
              <div
                data-parallax-speed={figure.speed}
                className="absolute"
                style={{
                  left: `${figure.left}%`,
                  bottom: `${figure.bottom}%`,
                  height: `${(figure.height / anchor.rowSpan) * 100}%`,
                }}
              >
                <motion.div
                  className="h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, ease, delay: afterTiles }}
                >
                  {figure.image ? (
                    <Image
                      src={figure.image.src}
                      alt={figure.alt}
                      width={figure.image.width}
                      height={figure.image.height}
                      sizes="10vw"
                      className="h-full w-auto max-w-none"
                    />
                  ) : (
                    <PlaceholderFigure variant={figure.variant} />
                  )}
                </motion.div>
              </div>
            </div>
          );
        })}

      </div>

        <div className="hero-name-block relative z-10">
          <motion.div
            className="flex flex-col items-start md:w-max md:items-end"
            initial={{ opacity: 0, y: rise }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: afterTiles }}
          >
            <h1 className="hero-name font-heading text-[10.8vw] leading-[0.9] font-semibold whitespace-nowrap text-ink-green">
              {hero.name}
            </h1>
            <div className="hero-labels mt-3 flex flex-col items-start md:items-end">
              <p className="hero-portfolio font-heading text-xl font-medium text-ink-green">
                {hero.portfolioLabel}
              </p>
              <p className="hero-works font-heading text-sm font-normal text-ink-green">
                {hero.worksLabel}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
