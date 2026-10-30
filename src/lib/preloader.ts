"use client";

import { useSyncExternalStore } from "react";

let done = false;
const listeners = new Set<() => void>();

export function markPreloaderDone() {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
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
