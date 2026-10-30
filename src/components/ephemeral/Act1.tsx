import Image from "next/image";
import type { ReactNode } from "react";
import Grain from "@/components/Grain";
import RevealImage from "@/components/RevealImage";
import TornCard from "@/components/TornCard";
import { act1, images, type EgImage } from "@/content/ephemeral-ground";
import { ephemeralGroundPreview as home } from "@/content/home";
import { MAP_H, MAP_W } from "@/lib/ephemeral-geometry";
import StaggerIn from "./StaggerIn";

const MAP_RATIO = MAP_W / MAP_H;

const heading = "font-heading font-semibold text-ink-green";
const body = "font-body text-[clamp(0.95rem,1.05vw,1.05rem)] leading-relaxed text-ink-green";

function Credit({ children }: { children: ReactNode }) {
  return <figcaption className="mt-1.5 font-ui text-[11px] leading-snug text-ink-green/70">{children}</figcaption>;
}

function Figure({ image, sizes }: { image: EgImage; sizes: string }) {
  const { src, width, height } = images[image.name];
  return (
    <figure>
      <RevealImage src={src} alt={image.alt} width={width} height={height} sizes={sizes} className="block h-auto w-full" />
      {image.credit && <Credit>{image.credit}</Credit>}
    </figure>
  );
}

/** The map cropped to one camera stop, for phones and reduced motion. */
function StaticFrame({ focus, scale, ratio, alt }: { focus: { x: number; y: number }; scale: number; ratio: number; alt: string }) {
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
        </div>
      </div>
      <Credit>{act1.coastlineCredit}</Credit>
    </figure>
  );
}

type CardProps = { id: string; seed: number; wide?: boolean; left?: boolean; gap?: "first" | "hold" | "move"; children: ReactNode };

const gaps = { first: "md:motion-safe:pt-[22svh] md:motion-safe:pb-[45svh]", hold: "md:motion-safe:py-[28svh]", move: "md:motion-safe:py-[45svh]" };

function Card({ id, seed, wide, left, gap = "hold", children }: CardProps) {
  return (
    <div
      id={id}
      className={`relative px-4 py-3 md:motion-safe:flex ${left ? "md:motion-safe:pl-[3vw]" : "md:motion-safe:justify-end md:motion-safe:pr-[3vw]"} ${gaps[gap]}`}
    >
      {/* The shadow sits on a wrapper: clip-path would cut it off the card itself. */}
      <div
        data-act-card
        className={`drop-shadow-[-6px_8px_6px_rgba(34,48,42,0.28)] ${wide ? "md:mx-auto md:max-w-5xl md:motion-safe:mx-0 md:motion-safe:w-[70vw] md:motion-safe:max-w-none lg:motion-safe:w-[62vw]" : "md:mx-auto md:max-w-2xl md:motion-safe:mx-0 md:motion-safe:w-[max(34vw,20rem)] md:motion-safe:max-w-[32rem]"}`}
      >
        <TornCard seed={seed} className="paper-fibre relative bg-paper px-7 py-9 md:px-10 md:py-11">
          {children}
          <Grain surface="colour" />
        </TornCard>
      </div>
    </div>
  );
}

function ColumnTitle({ children }: { children: ReactNode }) {
  return <h4 className={`${heading} text-[clamp(1rem,1.25vw,1.2rem)] leading-tight`}>{children}</h4>;
}

export default function Act1({ id }: { id: string }) {
  const { stops, ocean, strait, people, proposal, stake, lessons } = act1;

  return (
    <section id={id} aria-labelledby={`${id}-title`}>
        <div>
          <StaticFrame focus={stops[0].center} scale={stops[0].scale} ratio={MAP_RATIO} alt={home.mapAlt} />
          <Card id="ocean" seed={101} gap="first">
            <p className={body}>{ocean.text}</p>
          </Card>
        </div>

        <div data-act-leg>
          <StaticFrame focus={stops[1].center} scale={stops[1].scale} ratio={MAP_RATIO} alt={strait.frameAlt} />
          <Card id="strait-of-malacca" seed={102} left gap="move">
            <h3 className={`${heading} text-[clamp(1.35rem,2vw,1.9rem)] leading-tight`}>{strait.title}</h3>
            <p className={`${body} mt-3`}>{strait.text}</p>
            <div className="mt-5">
              <Figure image={strait.image} sizes="(max-width: 768px) 90vw, 30vw" />
            </div>
          </Card>
        </div>

        <div>
          <div data-act-leg>
            <StaticFrame focus={stops[2].focus} scale={stops[2].scale} ratio={0.9} alt={people.frameAlt} />
            <Card id="the-people" seed={103} gap="move">
              <h3 className={`${heading} text-[clamp(1.35rem,2vw,1.9rem)] leading-tight`}>{people.title}</h3>
              <p className="mt-1 font-body text-ink-green italic">{people.subtitle}</p>
              <p className={`${body} mt-3`}>{people.text}</p>
              <h4 className={`${heading} mt-6 text-[clamp(1rem,1.25vw,1.2rem)]`}>{people.dwellingTitle}</h4>
              <div className="mt-3 grid grid-cols-[1.82fr_0.84fr] gap-2">
                {people.huts.map((hut) => (
                  <Figure key={hut.name} image={hut} sizes="(max-width: 768px) 60vw, 20vw" />
                ))}
              </div>
            </Card>
          </div>

          <Card id="proposal" seed={104} wide>
            <h3 className={`${heading} text-[clamp(1.35rem,2vw,1.9rem)] leading-tight`}>{proposal.title}</h3>
            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              <Figure image={proposal.map} sizes="(max-width: 768px) 90vw, 24vw" />
              <div>
                <h4 className={`${heading} text-[clamp(1rem,1.25vw,1.2rem)]`}>{proposal.scaleTitle}</h4>
                <StaggerIn>
                  <dl className="mt-3 grid grid-cols-2 gap-x-5 gap-y-4">
                    {proposal.scale.map((item) => (
                      <div key={item.value} data-stagger>
                        <dd className={`${heading} text-[clamp(1.4rem,2.2vw,2.1rem)] leading-none`}>{item.value}</dd>
                        <dt className="mt-1 font-body text-sm text-ink-green">{item.label}</dt>
                      </div>
                    ))}
                  </dl>
                  <p data-stagger className="mt-6 font-body text-ink-green">
                    {proposal.populationFrom} <span aria-hidden="true">→</span>{" "}
                    <span className="sr-only">to </span>
                    {proposal.populationTo}
                  </p>
                  <ul className="mt-3 grid grid-cols-3 gap-3">
                    {proposal.population.map((group) => (
                      <li key={group.label} data-stagger>
                        <p className={`${heading} text-[clamp(1.05rem,1.5vw,1.4rem)] leading-none`}>{group.value}</p>
                        <p className="mt-1 font-body text-sm leading-tight text-ink-green">{group.label}</p>
                        <p className="font-body text-xs leading-tight text-ink-green/80">{group.note}</p>
                      </li>
                    ))}
                  </ul>
                </StaggerIn>
              </div>
            </div>
            <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {proposal.projects.map((project) => {
                const icon = images[project.icon];
                return (
                  <li key={project.title}>
                    <Image src={icon.src} alt="" width={icon.width} height={icon.height} sizes="80px" className="h-14 w-auto mix-blend-multiply" />
                    <ColumnTitle>{project.title}</ColumnTitle>
                    {project.text.map((line) => (
                      <p key={line} className="mt-2 font-body text-sm leading-snug text-ink-green">
                        {line}
                      </p>
                    ))}
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 font-ui text-[11px] text-ink-green/70">{proposal.iconsCredit}</p>
          </Card>

          <Card id="at-stake" seed={105} wide>
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
              {stake.map((column) => (
                <div key={column.title}>
                  <ColumnTitle>{column.title}</ColumnTitle>
                  <p className="mt-2 font-body text-sm leading-relaxed text-ink-green">{column.text}</p>
                  <div className={`mt-3 grid gap-2 ${column.images.length > 1 ? "grid-cols-2" : ""}`}>
                    {column.images.map((image) => (
                      <Figure key={image.name} image={image} sizes="(max-width: 768px) 45vw, 15vw" />
                    ))}
                  </div>
                  {column.source && <p className="mt-2 font-ui text-[11px] leading-snug text-ink-green/70">{column.source}</p>}
                </div>
              ))}
            </div>
          </Card>

          <Card id="lessons" seed={106} wide>
            <h3 className={`${heading} text-[clamp(1.35rem,2vw,1.9rem)] leading-tight`}>{lessons.title}</h3>
            <p className={`${body} mt-3 max-w-[64ch]`}>{lessons.text}</p>
            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <StaggerIn step={0.06}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[26rem] border-collapse text-left font-body text-[13px] text-ink-green tabular-nums">
                    <caption className="sr-only">{lessons.tableCaption}</caption>
                    <thead>
                      <tr className="border-b-2 border-ink-green/60 font-ui text-[10px] tracking-wide uppercase">
                        {lessons.tableHead.map((column) => (
                          <th key={column} scope="col" className="pr-2 pb-1.5 align-bottom font-bold">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lessons.tableRows.map(([year, ...cells]) => (
                        <tr key={year} data-stagger className="border-b border-ink-green/20">
                          <th scope="row" className="py-1 pr-2 font-semibold">
                            {year}
                          </th>
                          {cells.map((cell, i) => (
                            <td key={i} className="py-1 pr-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 font-ui text-[11px] text-ink-green/70">{lessons.tableCredit}</p>
              </StaggerIn>
              <Figure image={lessons.maps} sizes="(max-width: 768px) 90vw, 24vw" />
            </div>
          </Card>
        </div>
    </section>
  );
}
