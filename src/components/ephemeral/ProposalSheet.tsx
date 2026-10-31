"use client";

import { useCallback, type ReactNode } from "react";
import gsap from "gsap";
import SheetGrid from "@/components/sheet/SheetGrid";
import { act1 } from "@/content/ephemeral-ground";
import type { TitleBlockProps } from "@/components/sheet/TitleBlock";

const { zones } = act1.proposal;

/** 1.4's first sheet. Each row of its key is a reveal group, and raises its zone on the stage behind the window. */
export default function ProposalSheet({ title, children }: { title: TitleBlockProps; children: ReactNode }) {
  const raise = useCallback((group: number) => {
    const zone = zones[group - 1];
    // Looked up by hand: a selector string here would only search this sheet, and the zones are on the stage.
    if (zone) gsap.to(document.querySelectorAll(`[data-stage-zone="${zone.id}"]`), { opacity: 1, duration: 0.7, ease: "power2.out" });
  }, []);

  return (
    <SheetGrid title={title} slow hold onGroupStart={raise}>
      {children}
    </SheetGrid>
  );
}
