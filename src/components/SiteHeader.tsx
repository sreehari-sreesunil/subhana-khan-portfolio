import TransitionLink from "@/components/TransitionLink";
import { site } from "@/content/site";

const variants = {
  default: "text-accent-terracotta",
  // Over her grey-blue sections, as on her page 01.
  light: "text-paper-white",
  // Over the Ephemeral Ground numeral: the halo keeps the link legible and vanishes on white.
  halo: "text-accent-terracotta [-webkit-text-stroke:3px_white] [paint-order:stroke_fill]",
};

export default function SiteHeader({ variant = "default" }: { variant?: keyof typeof variants }) {
  return (
    <header
      className={`absolute inset-x-0 top-0 z-30 flex h-(--header-h) items-center justify-between px-4 font-ui text-xs md:px-10 ${variants[variant]}`}
    >
      <TransitionLink
        href="/"
        inertOnCurrentPage
        className="underline-offset-4 hover:underline focus-visible:underline"
      >
        {site.portfolioLabel}
      </TransitionLink>
      <span>{site.worksLabel}</span>
    </header>
  );
}
