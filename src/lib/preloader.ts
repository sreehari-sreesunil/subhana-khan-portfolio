"use client";

import { useSyncExternalStore } from "react";
import { PRELOADER_ATTR, PRELOADER_KEY } from "./preloader-script";

let done = false;
// A page transition owns the hero's entrance until its sheet is leaving.
let held = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export function markPreloaderDone() {
  if (done || held) return;
  done = true;
  emit();
}

/** Puts the hero back to its hidden state, ready to replay its entrance. */
export function holdHero() {
  held = true;
  done = false;
  emit();
}

export function releaseHero() {
  if (!held) return;
  held = false;
  done = true;
  emit();
}

export function markPreloaderSeen() {
  try {
    sessionStorage.setItem(PRELOADER_KEY, "1");
  } catch {
    // Storage unavailable: it simply shows again on the next load.
  }
  document.documentElement.setAttribute(PRELOADER_ATTR, "");
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** False on the server and during hydration, so server and client render the same markup. */
export function usePreloaderDone() {
  return useSyncExternalStore(
    subscribe,
    () => done,
    () => false,
  );
}
