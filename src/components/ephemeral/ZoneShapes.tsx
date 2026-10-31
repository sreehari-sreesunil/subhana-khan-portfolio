import { act1, type ZoneId } from "@/content/ephemeral-ground";
import { zoneIsland, zoneMarkers, zonePaths } from "@/content/ephemeral-zones";

export const zoneColours: Record<ZoneId, string> = {
  campbell: "var(--sage)",
  galathea: "color-mix(in srgb, var(--sage) 50%, var(--sand))",
  port: "var(--accent-terracotta)",
  airport: "var(--ink-brown)",
  township: "color-mix(in srgb, var(--accent-terracotta) 55%, var(--sand))",
  power: "var(--ink-green)",
};

// Parks and township end at our coast. Port and airport don't: part of them is land to be reclaimed.
const CLIPPED: ZoneId[] = ["galathea", "campbell", "township"];
const PAINT_ORDER: ZoneId[] = [...CLIPPED, "port", "airport", "power"];

type ZoneShapesProps = {
  /** The clip path's id: unique per page, since Next can keep two pages in the DOM. */
  id: string;
  /** Each zone starts hidden, for a sheet to raise (`[data-stage-zone]`). */
  hidden?: boolean;
  /** Marker radius, in map units. */
  marker?: number;
};

/** The proposed zones, for an <svg> in map units, numbered as on her map. */
export default function ZoneShapes({ id, hidden, marker = 0.3 }: ZoneShapesProps) {
  return (
    <>
      <clipPath id={id}>
        <path d={zoneIsland} />
      </clipPath>
      {PAINT_ORDER.map((zone) => {
        const number = act1.proposal.zones.find((item) => item.id === zone)?.marker;
        const at = zone in zoneMarkers ? zoneMarkers[zone as keyof typeof zoneMarkers] : undefined;
        return (
          <g key={zone} data-stage-zone={zone} opacity={hidden ? 0 : 1}>
            {zone in zonePaths && (
              <path
                d={zonePaths[zone as keyof typeof zonePaths]}
                fillRule="evenodd"
                clipPath={CLIPPED.includes(zone) ? `url(#${id})` : undefined}
                style={{ fill: zoneColours[zone] }}
              />
            )}
            {at && number && (
              <>
                <circle cx={at.x} cy={at.y} r={marker} className="fill-ink-green" />
                <text x={at.x} y={at.y} dy="0.36em" textAnchor="middle" fontSize={marker * 1.15} className="fill-paper font-ui font-bold">
                  {number}
                </text>
              </>
            )}
          </g>
        );
      })}
    </>
  );
}
