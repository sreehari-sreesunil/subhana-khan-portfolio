import type { Metadata } from "next";
import Grain from "@/components/Grain";
import SiteHeader from "@/components/SiteHeader";
import TransitionLink from "@/components/TransitionLink";

export const metadata: Metadata = { title: "Ephemeral Ground — Subhana Khan" };

// TEMP stub: the Ephemeral Ground scroll story (p.06–24) is built later.
export default function EphemeralGroundPage() {
  return (
    <>
      <SiteHeader />
      <main className="paper-fibre relative flex flex-1 bg-paper flex-col items-start justify-center gap-6 px-4 py-32 md:px-10">
        <h1 className="font-heading text-4xl font-semibold text-ink-green">EPHEMERAL GROUND</h1>
        <TransitionLink
          href="/"
          className="font-ui text-sm tracking-wide text-accent-terracotta underline-offset-4 hover:underline"
        >
          <span aria-hidden="true">←</span> Back to home
        </TransitionLink>
        <Grain surface="colour" />
      </main>
    </>
  );
}
