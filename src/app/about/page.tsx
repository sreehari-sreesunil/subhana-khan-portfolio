import Cv from "@/components/about/Cv";
import AboutIntro from "@/components/home/AboutIntro";
import { aboutIntro } from "@/content/about";

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <AboutIntro content={aboutIntro} headingLevel="h1" static />
      <Cv />
    </main>
  );
}
