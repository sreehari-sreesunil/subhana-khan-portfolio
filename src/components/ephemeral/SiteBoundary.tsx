import { MAP_H, MAP_W, outlinePoints, storyOutlinePoints } from "@/lib/ephemeral-geometry";

const RED = "#E2002C";

type SiteBoundaryProps = {
  /** The mask's id: unique per page, since Next can keep two pages in the DOM. */
  id: string;
  /** Dot spacing, in map units. */
  dots: string;
  /** Defaults to the home page's outline, which matches her enlarged plan. */
  points?: string;
};

/**
 * The site's dotted outline, for an <svg> in map units. To draw it, tween [data-site-reveal]'s
 * stroke-dashoffset to 0 with [data-site-boundary] at opacity 1, and keep its stroke-width constant on screen.
 */
export default function SiteBoundary({ id, dots, points = outlinePoints }: SiteBoundaryProps) {
  return (
    <>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={MAP_W} height={MAP_H}>
        <polygon
          data-site-reveal
          points={points}
          fill="none"
          stroke="white"
          strokeWidth="1"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
        />
      </mask>
      <g mask={`url(#${id})`}>
        <polygon data-site-boundary points={points} fill="none" stroke={RED} strokeLinecap="round" strokeDasharray={dots} opacity="0" />
      </g>
    </>
  );
}

/** The same outline, already drawn, for frames with no camera. */
export function SiteOutline() {
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 size-full">
      <polygon
        points={storyOutlinePoints}
        fill="none"
        stroke={RED}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="0 9"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
