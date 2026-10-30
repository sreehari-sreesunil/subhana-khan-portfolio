"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

const FEEDBACK_MS = 2000;

export default function CopyEmail() {
  const { email } = site.contact;
  const [label, setLabel] = useState(site.footer.copy);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const show = (message: string) => {
    setLabel(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setLabel(site.footer.copy), FEEDBACK_MS);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Clipboard needs https or localhost; on a plain http address, fall back to a selection.
      const field = document.createElement("textarea");
      field.value = email;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.append(field);
      field.select();
      const worked = document.execCommand("copy");
      field.remove();
      if (!worked) {
        show(site.footer.copyFailed);
        return;
      }
    }
    show(site.footer.copied);
  };

  return (
    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
      <a
        href={`mailto:${email}`}
        className="font-heading text-[clamp(1.3rem,4vw,3.25rem)] leading-tight font-semibold text-ink-green underline-offset-4 hover:underline"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="font-ui text-sm tracking-wide text-accent-terracotta underline-offset-4 hover:underline md:text-base"
      >
        <span aria-live="polite">{label}</span>
      </button>
    </div>
  );
}
