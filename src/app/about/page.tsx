import Link from "next/link";
import { about } from "@/content/home";

// TEMP stub: the full About page (intro p.01 + CV p.02) is built later.
export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col items-start justify-center gap-6 px-4 py-32 md:px-10">
      <h1 className="font-heading text-4xl font-semibold text-ink-green">{about.heading}</h1>
      <Link
        href="/"
        className="font-ui text-sm tracking-wide text-accent-terracotta underline-offset-4 hover:underline"
      >
        <span aria-hidden="true">←</span> Back to home
      </Link>
    </main>
  );
}
