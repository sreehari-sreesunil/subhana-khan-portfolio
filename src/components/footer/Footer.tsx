import Image from "next/image";
import Grain from "@/components/Grain";
import TransitionLink from "@/components/TransitionLink";
import { site } from "@/content/site";
import CopyEmail from "./CopyEmail";
import SunPath from "./SunPath";

export default function Footer() {
  const { footer } = site;
  return (
    <footer data-site-footer className="paper-fibre relative flex flex-col bg-paper md:min-h-svh">
      <SunPath />

      <div className="flex flex-1 flex-col justify-between gap-10 px-4 pt-10 pb-8 md:px-10 md:pt-[4svh] md:pb-[4svh]">
        <Image
          src={footer.thankYou.src}
          alt={footer.thankYou.alt}
          width={footer.thankYou.width}
          height={footer.thankYou.height}
          className="h-auto w-[min(70vw,24rem)] md:w-[clamp(16rem,26vw,26rem)]"
        />

        <div>
          <CopyEmail />
          <p className="mt-2 font-ui text-ink-green md:text-lg">{site.contact.location}</p>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 font-ui text-sm tracking-wide text-accent-terracotta md:text-base">
          <nav aria-label={footer.navLabel} className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.links.map((link) => (
              <TransitionLink key={link.href} href={link.href} className="underline-offset-4 hover:underline">
                {link.label}
              </TransitionLink>
            ))}
            {footer.portfolioPdf && (
              <a href={footer.portfolioPdf} download className="underline-offset-4 hover:underline">
                {footer.portfolioPdfLabel}
              </a>
            )}
          </nav>
          <p>{footer.copyright}</p>
        </div>
      </div>

      <Grain surface="colour" />
    </footer>
  );
}
