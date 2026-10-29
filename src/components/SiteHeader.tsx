import { site } from "@/content/site";

export default function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-4 font-ui text-xs text-accent-terracotta md:px-10 md:py-6">
      <span>{site.portfolioLabel}</span>
      <span>{site.worksLabel}</span>
    </header>
  );
}
