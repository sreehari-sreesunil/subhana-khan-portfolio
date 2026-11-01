import Drawing from "@/components/sheet/Drawing";
import SheetBlock from "@/components/sheet/SheetBlock";
import SheetGrid from "@/components/sheet/SheetGrid";
import { headingClass, Lines } from "@/components/sheet/SheetText";
import { act4, images } from "@/content/ephemeral-ground";
import CommunityHall from "./CommunityHall";
import CommunityKitchen from "./CommunityKitchen";
import CulturalCenter from "./CulturalCenter";
import DesignProgram from "./DesignProgram";
import Masterplan from "./Masterplan";
import StrategiesSheet from "./StrategiesSheet";
import TsunamiDesign from "./TsunamiDesign";
import VisitorsCenter from "./VisitorsCenter";

const { opening, sheets } = act4;

// Her words are this sheet's hero: the collage is too small to carry one.
const leadClass = "font-body text-[clamp(1.0625rem,min(1.7vw,2.9svh),1.75rem)] leading-relaxed text-ink-green lg:max-w-[33em]";

function OpeningSheet({ id, title }: { id: string; title: string }) {
  return (
    <SheetGrid id="everything-passes" title={{ act: title, sheet: sheets.opening }} slow hold>
      <SheetBlock at="A1:G1">
        <h2 id={`${id}-title`} tabIndex={-1} data-sheet-step="text" data-sheet-group={0} className={headingClass}>
          {title}
        </h2>
      </SheetBlock>
      <SheetBlock at="A2:G7">
        <Lines group={0} className={leadClass}>
          {opening.text}
        </Lines>
      </SheetBlock>
      <Drawing
        image={images[opening.image.name]}
        alt={opening.image.alt}
        at="I2:K6"
        figure={opening.image.figure}
        group={0}
        sizes="(max-width: 1024px) 92vw, 24vw"
      />
    </SheetGrid>
  );
}

export default function Act4({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <OpeningSheet id={id} title={title} />
      <Masterplan title={title} />
      <DesignProgram title={title} />
      <TsunamiDesign title={title} />
      <StrategiesSheet title={title} />
      <CommunityHall title={title} />
      <CommunityKitchen title={title} />
      <VisitorsCenter title={title} />
      <CulturalCenter title={title} />
    </section>
  );
}
