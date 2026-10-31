import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import SunPath from "@/components/footer/SunPath";
import RevealImage from "@/components/RevealImage";
import Callout from "@/components/sheet/Callout";
import Drawing from "@/components/sheet/Drawing";
import Inhabitant from "@/components/sheet/Inhabitant";
import KeyPlan from "@/components/sheet/KeyPlan";
import SheetBlock from "@/components/sheet/SheetBlock";
import SheetGrid from "@/components/sheet/SheetGrid";
import SiteHeader from "@/components/SiteHeader";
import TransitionLink from "@/components/TransitionLink";
import { act1, images as egImages } from "@/content/ephemeral-ground";
import { ephemeralGroundPreview as home, hero } from "@/content/home";
import { MAP_H, MAP_W } from "@/lib/ephemeral-geometry";
import ViewerDemo from "./ViewerDemo";

export const metadata: Metadata = { title: "Lab — Subhana Khan", robots: { index: false } };

const images = [
  { src: "/images/home/preloader/2021.webp", width: 438, height: 600 },
  { src: "/images/home/preloader/2022.webp", width: 600, height: 319 },
  { src: "/images/home/preloader/2024.webp", width: 600, height: 349 },
  { src: "/images/home/preloader/2025.webp", width: 401, height: 600 },
  { src: "/images/home/preloader/2023.webp", width: 600, height: 373 },
  { src: "/images/home/preloader/2026.webp", width: 600, height: 225 },
];

// Dev-only workbench for shared components.
export default function LabPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <>
      <SiteHeader />
      <main className="paper-fibre relative flex-1 bg-paper px-4 pt-28 pb-40 md:px-10">
        <h1 className="font-heading text-4xl font-semibold text-ink-green">Lab</h1>

        <div className="mt-10 grid max-w-3xl gap-6">
          <div data-cursor="enter" className="flex h-48 items-center justify-center bg-sand font-ui text-ink-green">
            data-cursor=&quot;enter&quot;
          </div>
          <p className="font-body text-ink-green">
            <TransitionLink href="/" className="text-accent-terracotta underline">
              A link
            </TransitionLink>{" "}
            and a{" "}
            <button type="button" className="text-accent-terracotta underline">
              button
            </button>
          </p>
          <textarea
            aria-label="Text field"
            defaultValue="A text field keeps the native cursor."
            className="h-28 w-full border border-ink-green/30 bg-paper-white p-3 font-body"
          />
        </div>

        <section aria-labelledby="sun-path-heading" className="mt-16">
          <h2 id="sun-path-heading" className="font-heading text-2xl font-semibold text-ink-green">
            Sun path
          </h2>
          <p className="mt-1 mb-4 font-ui text-sm text-ink-green">Reference only: the footer uses the rotary dial.</p>
          <SunPath />
        </section>

        <section aria-labelledby="sheet-heading" className="-mx-4 mt-16 md:-mx-10">
          <h2 id="sheet-heading" className="mb-4 px-4 font-heading text-2xl font-semibold text-ink-green md:px-10">
            Living sheet: stage-window
          </h2>
          {/* A static map standing in for the camera stage. Scale and north are sample values. */}
          <div className="relative">
            <div className="absolute inset-0 hidden md:motion-safe:block">
              <Image src={home.map.src} alt="" fill sizes="100vw" className="object-cover" />
            </div>
            <SheetGrid title={{ act: "Lab", sheet: "00", scale: "1:500", north: 20 }}>
              <SheetBlock
                type="stage-window"
                at="A1:H8"
                fallback={<Image src={home.map.src} alt="" width={MAP_W} height={MAP_H} sizes="100vw" className="block h-auto w-full" />}
              />
              <SheetBlock at="I1:L3">
                <p data-sheet-step="text" data-sheet-group={0} className="font-body text-ink-green">
                  Sample text beside the window.
                </p>
                <p data-sheet-step="text" data-sheet-group={0} className="mt-2 font-ui text-[11px] text-ink-green/70">
                  {act1.coastlineCredit}
                </p>
              </SheetBlock>
            </SheetGrid>
          </div>
        </section>

        <section aria-labelledby="sheet-parts-heading" className="-mx-4 mt-16 md:-mx-10">
          <h2 id="sheet-parts-heading" className="mb-4 px-4 font-heading text-2xl font-semibold text-ink-green md:px-10">
            Living sheet: callout, key plan, inhabitant
          </h2>
          <SheetGrid title={{ act: "Lab", sheet: "00" }}>
            <Callout
              image={egImages["settlement/masterplan"]}
              alt=""
              at="A1:H4"
              figure="Fig. 0.0.1 — A drawing"
              spot={{ x: 0.3, y: 0.5, size: 0.14 }}
              sizes="60vw"
              detail={{ image: egImages["settlement/residential-plan"], alt: "", at: "I1:L4", figure: "Fig. 0.0.2 — A different, more detailed drawing", sizes: "30vw" }}
            />
            <Drawing image={egImages["settlement/kitchen-elevation"]} alt="" at="A5:H8" figure="Fig. 0.0.3 — An elevation, with a person inside it" group={1} sizes="60vw" />
            <Inhabitant image={hero.figures[1].image!} at="F6:F7" />
            <KeyPlan
              heading="Key Plan"
              image={egImages["ground/site-context"]}
              alt=""
              at="I5:L7"
              figure="Fig. 0.0.4 — A key plan"
              area={{ left: 0.02, top: 0.16, width: 0.09, height: 0.17 }}
              group={2}
              sizes="30vw"
            />
          </SheetGrid>
          <div className="mt-6 px-4 md:px-10">
            <ViewerDemo />
          </div>
        </section>

        <section aria-labelledby="eg-assets-heading" className="mt-16">
          <h2 id="eg-assets-heading" className="font-heading text-2xl font-semibold text-ink-green">
            Ephemeral Ground assets ({Object.keys(egImages).length})
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
            {Object.entries(egImages).map(([name, image]) => (
              <li key={name} data-eg-asset className="bg-paper-white p-2">
                <Image
                  src={image.src}
                  alt=""
                  width={image.width}
                  height={image.height}
                  sizes="20vw"
                  loading="eager"
                  className="h-28 w-full object-contain"
                />
                <p className="mt-1 font-ui text-[11px] break-all text-ink-green">
                  {name} {image.width}×{image.height}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-[90vh] grid gap-[60vh] md:grid-cols-2 md:gap-x-10">
          {images.map((image) => (
            <RevealImage key={image.src} alt="" sizes="(max-width: 768px) 100vw, 50vw" {...image} className="block h-auto w-full" />
          ))}
        </div>
      </main>
    </>
  );
}
