import { site } from "@/content/site";

const variants = {
  default: "text-accent-terracotta",
  // Over her grey-blue sections, as on her page 01.
  light: "text-paper-white",
};

export default function SiteHeader({ variant = "default" }: { variant?: keyof typeof variants }) {
  return (
    <header
      className={`absolute inset-x-0 top-0 z-30 flex h-(--header-h) items-center justify-between px-4 font-ui text-xs md:px-10 ${variants[variant]}`}
    >
      <span>{site.portfolioLabel}</span>
      <span>{site.worksLabel}</span>
    </header>
  );
}
