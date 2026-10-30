import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SunPath from "@/components/footer/SunPath";
import RevealImage from "@/components/RevealImage";
import SiteHeader from "@/components/SiteHeader";
import TransitionLink from "@/components/TransitionLink";

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

        <div className="mt-[90vh] grid gap-[60vh] md:grid-cols-2 md:gap-x-10">
          {images.map((image) => (
            <RevealImage key={image.src} alt="" sizes="(max-width: 768px) 100vw, 50vw" {...image} className="block h-auto w-full" />
          ))}
        </div>
      </main>
    </>
  );
}
