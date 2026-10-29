import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      {/* // TEMP: scroll room for testing the hero people scene; remove when section 2 exists. */}
      <section aria-hidden="true" className="h-[150vh]" />
    </main>
  );
}
