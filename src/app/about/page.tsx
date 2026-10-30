import type { Metadata } from "next";
import Cv from "@/components/about/Cv";
import ScreenSnap from "@/components/about/ScreenSnap";
import AboutIntro from "@/components/home/AboutIntro";
import { aboutIntro } from "@/content/about";

export const metadata: Metadata = { title: "About — Subhana Khan" };

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <AboutIntro content={aboutIntro} headingLevel="h1" static />
      <Cv />
      <ScreenSnap />
    </main>
  );
}
