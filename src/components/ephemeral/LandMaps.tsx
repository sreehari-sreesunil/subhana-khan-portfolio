import Image from "next/image";
import Grain from "@/components/Grain";
import TornCard from "@/components/TornCard";
import { act3, images } from "@/content/ephemeral-ground";

const { maps } = act3.landAnalysis;

// Lives on the stage so the three maps can change in place without a second sticky element.
export default function LandMaps() {
  return (
    <div className="h-full drop-shadow-[-6px_8px_6px_rgba(34,48,42,0.28)]">
      <TornCard seed={121} className="relative h-full bg-paper-white">
        {maps.map((map) => {
          const { src, width, height } = images[map.name];
          return (
            <figure key={map.name} data-stage-map className="absolute inset-0 flex flex-col bg-paper-white px-5 pt-5 pb-7 opacity-0 first:opacity-100">
              <div className="relative min-h-0 flex-1">
                <Image src={src} alt={map.alt} width={width} height={height} sizes="35vw" className="mx-auto block h-full w-auto object-contain" />
              </div>
              <figcaption className="mt-2 text-center font-ui text-[11px] leading-snug text-ink-green/70">{map.credit}</figcaption>
            </figure>
          );
        })}
        <Grain surface="white" />
      </TornCard>
    </div>
  );
}
