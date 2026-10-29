import { site } from "@/content/site";

export default function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex h-(--header-h) items-center justify-between px-4 font-ui text-xs text-accent-terracotta md:px-10">
      <span>{site.portfolioLabel}</span>
      <span>{site.worksLabel}</span>
    </header>
  );
}
