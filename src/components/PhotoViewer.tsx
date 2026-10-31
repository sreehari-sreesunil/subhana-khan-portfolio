"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent } from "react";
import Grain from "@/components/Grain";
import { getLenis } from "@/components/SmoothScroll";
import { site } from "@/content/site";

export type ViewerPhoto = { src: string; width: number; height: number; alt: string; caption?: string; credit?: string };

// Past this a small source only gets blurrier, so it stops. Originals fill the screen with no change here.
const MAX_ENLARGEMENT = 3;
const SWIPE_PX = 50;

type PhotoViewerProps = {
  photos: ViewerPhoto[];
  /** The photo showing, or null when closed. */
  index: number | null;
  onChange: (index: number | null) => void;
};

/** Full-screen photos. The browser's own dialog traps focus, closes on Escape and hands focus back to what opened it. */
export default function PhotoViewer({ photos, index, onChange }: PhotoViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const { viewer } = site;
  const count = photos.length;
  const isOpen = index !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open === isOpen) return;
    if (isOpen) {
      dialog.showModal();
      getLenis()?.stop();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const step = (by: number) => {
    if (index !== null) onChange((index + by + count) % count);
  };

  const onPointerDown = (event: PointerEvent) => {
    swipeStart.current = event.pointerType === "mouse" ? null : { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const [dx, dy] = [event.clientX - start.x, event.clientY - start.y];
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
  };

  const photo = index === null ? null : photos[index];
  const neighbours = index === null ? [] : [photos[(index + 1) % count], photos[(index - 1 + count) % count]];
  const button = "pointer-events-auto font-ui text-sm text-accent-terracotta underline-offset-4 hover:underline focus-visible:underline";

  return (
    <dialog
      ref={dialogRef}
      aria-label={viewer.label}
      onClose={() => {
        getLenis()?.start();
        onChange(null);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
      }}
      className="paper-fibre fixed inset-0 m-0 h-svh max-h-none w-screen max-w-none overflow-hidden bg-paper p-0 open:flex open:flex-col"
    >
      {photo && (
        <>
          <div className="relative z-50 flex items-center justify-between gap-4 px-4 pt-3 md:px-10">
            <p aria-live="polite" className="font-ui text-sm text-ink-green">
              {index! + 1} / {count}
            </p>
            <button type="button" className={button} onClick={() => onChange(null)}>
              {viewer.close}
            </button>
          </div>
          <div onPointerDown={onPointerDown} onPointerUp={onPointerUp} className="flex min-h-0 flex-1 touch-pan-y items-center justify-center px-4 py-3 md:px-10">
            <div
              key={photo.src}
              className="viewer-photo relative"
              style={{
                width: `min(100%, ${photo.width * MAX_ENLARGEMENT}px, calc((100svh - 8rem) * ${photo.width / photo.height}))`,
                aspectRatio: photo.width / photo.height,
              }}
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="100vw" />
            </div>
          </div>
          <div className="relative z-50 flex items-end justify-between gap-4 px-4 pb-4 md:px-10">
            <button type="button" className={button} onClick={() => step(-1)}>
              {viewer.previous}
            </button>
            <p className="min-w-0 text-center font-ui text-[11px] leading-snug text-ink-green/70">
              {photo.caption && <span className="block text-ink-green">{photo.caption}</span>}
              {photo.credit}
            </p>
            <button type="button" className={button} onClick={() => step(1)}>
              {viewer.next}
            </button>
          </div>
          {neighbours.map((next) => (
            <Image key={next.src} src={next.src} alt="" width={next.width} height={next.height} sizes="100vw" loading="eager" className="hidden" />
          ))}
          <Grain surface="colour" />
        </>
      )}
    </dialog>
  );
}
