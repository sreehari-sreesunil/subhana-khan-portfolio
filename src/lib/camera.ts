import gsap from "gsap";

type Point = { x: number; y: number };

/** Where the camera rests: the world point at the frame's centre, how far it's zoomed in, and how far it's turned. */
export type CameraStop = { center: Point; scale: number; /** Degrees clockwise. */ rotation?: number };

type CameraOptions = {
  /** The element holding everything the camera looks at. It fills its box at scale 1. */
  world: HTMLElement;
  /** The world's own units, such as the map's viewBox. */
  size: { width: number; height: number };
  /** At least two, in order. */
  stops: CameraStop[];
  /** Runs after each move, for anything that has to counter the scale. */
  onMove?: (scale: number, rotation: number) => void;
};

/** `point` turned clockwise by `degrees`, and scaled. */
function turn(point: Point, degrees: number, scale: number) {
  const radians = (degrees * Math.PI) / 180;
  const [cos, sin] = [Math.cos(radians), Math.sin(radians)];
  return { x: (point.x * cos - point.y * sin) * scale, y: (point.x * sin + point.y * cos) * scale };
}

/** One camera over one world: tween `state.position` from 0 to the last stop's index, calling `place`. */
export function createCamera({ world, size, stops, onMove }: CameraOptions) {
  const state = { position: 0 };
  const middle = { x: size.width / 2, y: size.height / 2 };
  const view = { x: 0, y: 0, scale: 1, rotation: 0 };

  const place = () => {
    const index = Math.min(Math.floor(state.position), stops.length - 2);
    const zoom = state.position - index;
    const from = stops[index];
    const to = stops[index + 1];
    const [fromRotation, toRotation] = [from.rotation ?? 0, to.rotation ?? 0];
    // Logarithmic: equal steps of zoom multiply the scale by an equal amount.
    const scale = from.scale * (to.scale / from.scale) ** zoom;
    const rotation = gsap.utils.interpolate(fromRotation, toRotation, zoom);
    // The next stop's point starts wherever this stop shows it, and travels to the frame's centre.
    const offset = turn({ x: to.center.x - from.center.x, y: to.center.y - from.center.y }, fromRotation, from.scale);
    const screenX = gsap.utils.interpolate(middle.x + offset.x, middle.x, zoom);
    const screenY = gsap.utils.interpolate(middle.y + offset.y, middle.y, zoom);
    const target = turn(to.center, rotation, scale);
    Object.assign(view, { x: screenX - target.x, y: screenY - target.y, scale, rotation });
    gsap.set(world, {
      xPercent: (view.x / size.width) * 100,
      yPercent: (view.y / size.height) * 100,
      scale,
      rotation,
      // 2D transform keeps the SVG re-rendered sharp at every scale.
      force3D: false,
    });
    onMove?.(scale, rotation);
  };

  /** Where a world point is in the frame right now, in the world's own units. */
  const project = (point: Point) => {
    const turned = turn(point, view.rotation, view.scale);
    return { x: view.x + turned.x, y: view.y + turned.y };
  };

  gsap.set(world, { transformOrigin: "0 0" });
  place();

  return { state, place, project };
}
