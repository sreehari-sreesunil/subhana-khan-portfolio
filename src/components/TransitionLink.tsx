"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePageTransition } from "@/components/PageTransition";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

// Only a plain left-click on a link to another page of this site gets the sheet.
function usesBrowserDefault(event: MouseEvent<HTMLAnchorElement>, href: string, target?: string) {
  if (event.defaultPrevented || event.button !== 0) return true;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return true;
  if (target && target !== "_self") return true;
  if (event.currentTarget.hasAttribute("download")) return true;
  const url = new URL(href, window.location.href);
  return url.origin !== window.location.origin || url.pathname === window.location.pathname;
}

export default function TransitionLink({ href, onClick, ...props }: TransitionLinkProps) {
  const navigate = usePageTransition();

  return (
    <Link
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (usesBrowserDefault(event, href, props.target)) return;
        event.preventDefault();
        navigate(href);
      }}
    />
  );
}
