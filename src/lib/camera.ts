import gsap from "gsap";

type Point = { x: number; y: number };

type CameraOptions = {
  /** The element holding everything the camera looks at. It fills its frame at scale 1. */
  world: HTMLElement;
  /** The world's own units, such as the map's viewBox. */
  size: { width: number; height: number };
  /** The world point the camera closes in on, ending centred in the frame. */
  target: Point;
  /** The scale at zoom 1. */
  depth: number;
  /** Runs after each move, for anything that has to counter the scale. */
  onMove?: (scale: number) => void;
};

/** One camera over one world: tween `state.zoom` from 0 to 1, calling `place` as it changes. */
export function createCamera({ world, size, target, depth, onMove }: CameraOptions) {
  const state = { zoom: 0 };

  const place = () => {
    // Logarithmic: equal steps of zoom multiply the scale by an equal amount.
    const scale = depth ** state.zoom;
    const screenX = gsap.utils.interpolate(target.x, size.width / 2, state.zoom);
    const screenY = gsap.utils.interpolate(target.y, size.height / 2, state.zoom);
    gsap.set(world, {
      xPercent: ((screenX - target.x * scale) / size.width) * 100,
      yPercent: ((screenY - target.y * scale) / size.height) * 100,
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
