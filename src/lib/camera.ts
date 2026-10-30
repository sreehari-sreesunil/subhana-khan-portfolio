import gsap from "gsap";

type Point = { x: number; y: number };

/** Where the camera rests: the world point at the frame's centre, and how far it's zoomed in. */
export type CameraStop = { center: Point; scale: number };

type CameraOptions = {
  /** The element holding everything the camera looks at. It fills its box at scale 1. */
  world: HTMLElement;
  /** The world's own units, such as the map's viewBox. */
  size: { width: number; height: number };
  /** At least two, in order. */
  stops: CameraStop[];
  /** Runs after each move, for anything that has to counter the scale. */
  onMove?: (scale: number) => void;
};

/** One camera over one world: tween `state.position` from 0 to the last stop's index, calling `place`. */
export function createCamera({ world, size, stops, onMove }: CameraOptions) {
  const state = { position: 0 };
  const middle = { x: size.width / 2, y: size.height / 2 };

  const place = () => {
    const index = Math.min(Math.floor(state.position), stops.length - 2);
    const zoom = state.position - index;
    const from = stops[index];
    const to = stops[index + 1];
    // Logarithmic: equal steps of zoom multiply the scale by an equal amount.
    const scale = from.scale * (to.scale / from.scale) ** zoom;
    // The next stop's point starts wherever this stop shows it, and travels to the frame's centre.
    const startX = middle.x + (to.center.x - from.center.x) * from.scale;
    const startY = middle.y + (to.center.y - from.center.y) * from.scale;
    const screenX = gsap.utils.interpolate(startX, middle.x, zoom);
    const screenY = gsap.utils.interpolate(startY, middle.y, zoom);
    gsap.set(world, {
      xPercent: ((screenX - to.center.x * scale) / size.width) * 100,
      yPercent: ((screenY - to.center.y * scale) / size.height) * 100,
      scale,
      // 2D transform keeps the SVG re-rendered sharp at every scale.
      force3D: false,
    });
    onMove?.(scale);
  };

  gsap.set(world, { transformOrigin: "0 0" });
  place();

  return { state, place };
}
