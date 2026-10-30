import AboutIntro from "@/components/home/AboutIntro";
import { about } from "@/content/home";
import EphemeralGroundPreview from "@/components/home/EphemeralGroundPreview";
import Hero from "@/components/home/Hero";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <AboutIntro content={about} />
        <EphemeralGroundPreview />
      </main>
    </>
  );
}
