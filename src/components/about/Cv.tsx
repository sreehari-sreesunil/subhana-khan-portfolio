import Link from "next/link";
import type { ReactNode } from "react";
import { cv, type CvEntry } from "@/content/about";
import { site } from "@/content/site";
import CvReveal from "./CvReveal";

function Block({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section data-cv-block className={className}>
      <h3 className="font-heading text-base font-bold tracking-wide text-ink-green md:text-lg">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function YearList({ entries, className }: { entries: CvEntry[]; className: string }) {
  return (
    <ul className={`space-y-3.5 leading-snug text-ink-green ${className}`}>
      {entries.map((entry) => (
        <li key={`${entry.year}-${entry.text}`} data-cv-row className="grid grid-cols-[4.25rem_minmax(0,1fr)]">
          <span>{entry.year}</span>
          <span>{entry.text}</span>
        </li>
      ))}
    </ul>
  );
}

function PlainList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1 font-body leading-snug text-ink-green">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function Cv() {
  const { headings } = cv;
  return (
    <section aria-labelledby="cv-heading" className="bg-paper-white px-4 pt-16 pb-16 md:px-10 md:pt-20 md:pb-20">
      <CvReveal>
        <div data-cv-block>
          <h2
            id="cv-heading"
            className="font-heading text-[clamp(5rem,9vw,8rem)] leading-[0.85] font-bold tracking-tight text-ink-green"
          >
            {cv.title}
          </h2>
          <p className="mt-3 font-heading text-lg font-medium text-ink-green md:text-xl">{cv.name}</p>
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.15fr_0.7fr] md:gap-x-14 lg:gap-x-20">
          <div className="space-y-12">
            <Block title={headings.contact}>
              <ul className="space-y-1.5 font-heading text-ink-green">
                <li>
                  <a href={`mailto:${site.contact.email}`} className="underline-offset-4 hover:underline">
                    {site.contact.email}
                  </a>
                </li>
                <li>{site.contact.location}</li>
              </ul>
            </Block>
            <Block title={headings.education}>
              <ul className="space-y-3 font-heading leading-snug text-ink-green">
                {cv.education.map((school) => (
                  <li key={school.name}>
                    {school.name}
                    <span className="block italic">{school.note}</span>
                  </li>
                ))}
              </ul>
            </Block>
            <Block title={headings.competition}>
              <YearList entries={cv.competition} className="font-heading" />
            </Block>
          </div>

          <div className="space-y-12">
            <Block title={headings.software}>
              <ul className="grid max-w-[26rem] grid-cols-5 gap-x-1 gap-y-4">
                {cv.software.map((tool) => (
                  <li key={tool.label} className="flex flex-col items-center text-center">
                    <span
                      aria-hidden="true"
                      className="flex size-11 items-center justify-center rounded-full border-2 border-accent-terracotta font-heading text-base leading-none font-bold text-accent-terracotta md:size-12 md:text-lg"
                    >
                      {tool.abbr}
                    </span>
                    <span className="mt-1.5 font-body text-[11px] leading-tight text-ink-green md:text-xs">
                      {tool.label}
                    </span>
                  </li>
                ))}
              </ul>
            </Block>
            <Block title={headings.experience}>
              <YearList entries={cv.experience} className="font-body" />
            </Block>
          </div>

          <div className="space-y-12">
            <Block title={headings.workshops}>
              <PlainList items={cv.workshops} />
            </Block>
            <Block title={headings.skills}>
              <PlainList items={cv.skills} />
            </Block>
            <Block title={headings.languages}>
              <PlainList items={cv.languages} />
            </Block>
          </div>
        </div>
      </CvReveal>

      <p className="mt-16 md:mt-20">
        <Link
          href={cv.backLink.href}
          className="font-ui text-sm tracking-wide text-accent-terracotta underline-offset-4 hover:underline md:text-base"
        >
          <span aria-hidden="true">←</span> {cv.backLink.label}
        </Link>
      </p>
    </section>
  );
}
