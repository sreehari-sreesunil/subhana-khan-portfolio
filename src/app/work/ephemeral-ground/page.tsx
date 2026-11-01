import type { Metadata } from "next";
import Act1 from "@/components/ephemeral/Act1";
import Act2 from "@/components/ephemeral/Act2";
import Act3 from "@/components/ephemeral/Act3";
import Act4 from "@/components/ephemeral/Act4";
import ActNavigator from "@/components/ephemeral/ActNavigator";
import CameraStory from "@/components/ephemeral/CameraStory";
import Opening from "@/components/ephemeral/Opening";
import Grain from "@/components/Grain";
import SiteHeader from "@/components/SiteHeader";
import TransitionLink from "@/components/TransitionLink";
import { acts } from "@/content/ephemeral-ground";

export const metadata: Metadata = { title: "Ephemeral Ground — Subhana Khan" };

export default function EphemeralGroundPage() {
  const [first, second, third, fourth] = acts;
  return (
    <>
      <SiteHeader variant="halo" />
      <main className="flex-1">
        <Opening />
        <ActNavigator acts={acts.map(({ id, number, navLabel }) => ({ id, number, label: navLabel }))} />
        <CameraStory titleId={`${first.id}-title`} title={`${first.number} ${first.navLabel}`}>
          <Act1 id={first.id} title={`${first.number} ${first.navLabel}`} />
          <Act2 id={second.id} label={`${second.number} ${second.navLabel}`} />
          <Act3 id={third.id} title={`${third.number} ${third.navLabel}`} />
          <Act4 id={fourth.id} title={`${fourth.number} ${fourth.navLabel}`} />
        </CameraStory>
        {/* TEMP: until the rest of Act 4 is built. */}
        <div className="paper-fibre relative flex min-h-[40svh] items-center justify-center bg-paper px-4">
          <TransitionLink
            href="/"
            className="font-ui text-sm tracking-wide text-accent-terracotta underline-offset-4 hover:underline"
          >
            <span aria-hidden="true">←</span> Back to home
          </TransitionLink>
          <Grain surface="colour" />
        </div>
      </main>
    </>
  );
}
