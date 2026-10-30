import AboutIntro from "@/components/home/AboutIntro";
import { about } from "@/content/home";
import EphemeralGroundPreview from "@/components/home/EphemeralGroundPreview";
import Hero from "@/components/home/Hero";
import Preloader from "@/components/home/Preloader";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <Preloader />
      <main className="flex-1">
        <Hero />
        <AboutIntro content={about} />
        <EphemeralGroundPreview />
      </main>
    </>
  );
}
