import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Loads root's images a screen before it arrives. Call inside useGSAP.
 * A wipe-hidden image counts as off screen, so lazy loading would wait until the wipe had begun.
 */
export function fetchEarly(root: HTMLElement, selector = "img") {
  ScrollTrigger.create({
    trigger: root,
    start: "top bottom+=100%",
    once: true,
    onEnter: () => {
      root.querySelectorAll<HTMLImageElement>(selector).forEach((image) => {
        image.loading = "eager";
      });
    },
  });
}
