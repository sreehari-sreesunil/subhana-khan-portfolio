import Image from "next/image";
import { act2, images } from "@/content/ephemeral-ground";

const tree = images[act2.tree.name];
const walker = images[act2.walker.name];

/** Where the walker starts, off the right of the screen. As xPercent; she ends at 0, beside the tree. */
export const WALK_FROM = 210;

/** Her lone tree, and the walker with footprints. Whoever renders this moves [data-walker]. */
export default function SlownessMotif() {
  return (
    <>
      <Image
        src={tree.src}
        alt={act2.tree.alt}
        width={tree.width}
        height={tree.height}
        sizes="30vw"
        className="absolute bottom-0 left-[12%] h-full w-auto"
      />
      {/* Her feet sit 55% of the way down the image, level with the base of the tree. */}
      <div className="absolute bottom-0 left-[22%] w-[36%] translate-y-[45%]">
        <div data-walker>
          <Image src={walker.src} alt={act2.walker.alt} width={walker.width} height={walker.height} sizes="40vw" className="block h-auto w-full" />
        </div>
      </div>
    </>
  );
}
