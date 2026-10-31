import type { ReactNode } from "react";

export const headingClass = "font-heading text-[length:var(--sheet-heading)] leading-tight font-semibold text-ink-green";
export const nameClass = "font-heading text-[length:var(--sheet-name)] leading-tight font-semibold text-ink-green";
export const bodyClass = "font-body text-[length:var(--sheet-body)] leading-relaxed text-ink-green lg:max-w-[33em]";
export const smallClass = "font-body text-[length:var(--sheet-small)] leading-snug text-ink-green";

export function Lines({ group, className = bodyClass, children }: { group: number; className?: string; children: ReactNode }) {
  return (
    <p data-sheet-step="text" data-sheet-group={group} data-sheet-lines className={className}>
      {children}
    </p>
  );
}

export function Name({ group, children }: { group: number; children: ReactNode }) {
  return (
    <h4 data-sheet-step="text" data-sheet-group={group} className={`${nameClass} mb-2`}>
      {children}
    </h4>
  );
}
