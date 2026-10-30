import AboutIntro from "@/components/home/AboutIntro";
import { about } from "@/content/home";
import EphemeralGroundPreview from "@/components/home/EphemeralGroundPreview";
import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <AboutIntro content={about} />
      <EphemeralGroundPreview />
    </main>
  );
}
