"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { scrollToLink, usePageTransition } from "@/components/PageTransition";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Do nothing at all when this link points at the page already showing. */
  inertOnCurrentPage?: boolean;
};

// New tabs, downloads and external links are the browser's business.
function isPlainInternalClick(event: MouseEvent<HTMLAnchorElement>, href: string, target?: string) {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (target && target !== "_self") return false;
  if (event.currentTarget.hasAttribute("download")) return false;
  return new URL(href, window.location.href).origin === window.location.origin;
}

export default function TransitionLink({ href, onClick, inertOnCurrentPage, ...props }: TransitionLinkProps) {
  const { navigate, isBusy } = usePageTransition();

  return (
    <Link
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!isPlainInternalClick(event, href, props.target)) return;
        // The current page gets no sheet, unless one is already running: then this is the last click.
        const samePage = new URL(href, window.location.href).pathname === window.location.pathname;
        if (samePage && !isBusy()) {
          if (inertOnCurrentPage) event.preventDefault();
          else scrollToLink(href);
          return;
        }
        event.preventDefault();
        navigate(href);
      }}
    />
  );
}
