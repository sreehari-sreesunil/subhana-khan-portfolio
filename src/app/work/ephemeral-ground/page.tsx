import type { Metadata } from "next";
import Act1Zoom from "@/components/ephemeral/Act1Zoom";
import ActNavigator from "@/components/ephemeral/ActNavigator";
import Opening from "@/components/ephemeral/Opening";
import Grain from "@/components/Grain";
import SiteHeader from "@/components/SiteHeader";
import TransitionLink from "@/components/TransitionLink";
import { acts, credits, zoomStops } from "@/content/ephemeral-ground";

export const metadata: Metadata = { title: "Ephemeral Ground — Subhana Khan" };

export default function EphemeralGroundPage() {
  const [first, ...rest] = acts;
  return (
    <>
      <SiteHeader variant="halo" />
      <main className="flex-1">
        <Opening />
        <ActNavigator acts={acts.map(({ id, number, navLabel }) => ({ id, number, label: navLabel }))} />
        <Act1Zoom
          id={first.id}
          title={`${first.number} ${first.navLabel}`}
          credit={credits.coastline}
          stops={[zoomStops.ocean, zoomStops.island]}
        />
        {/* TEMP: placeholders until each act is built. */}
        {rest.map((act, i) => (
          <section
            key={act.id}
            id={act.id}
            aria-labelledby={`${act.id}-title`}
            className="paper-fibre relative flex min-h-svh flex-col items-center justify-center gap-6 bg-paper px-4"
          >
            <h2
              id={`${act.id}-title`}
              tabIndex={-1}
              className="font-heading text-[clamp(2rem,5vw,4.5rem)] font-semibold text-ink-green"
            >
              {act.number} {act.navLabel}
            </h2>
            {i === rest.length - 1 && (
              <TransitionLink
                href="/"
                className="font-ui text-sm tracking-wide text-accent-terracotta underline-offset-4 hover:underline"
              >
                <span aria-hidden="true">←</span> Back to home
              </TransitionLink>
            )}
            <Grain surface="colour" />
          </section>
        ))}
      </main>
    </>
  );
}
