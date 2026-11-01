"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import PhotoViewer, { type ViewerPhoto } from "@/components/PhotoViewer";
import Drawing, { FigureCaption } from "@/components/sheet/Drawing";
import KeyPlan from "@/components/sheet/KeyPlan";
import SheetBlock from "@/components/sheet/SheetBlock";
import SheetGrid from "@/components/sheet/SheetGrid";
import { headingClass, Lines, nameClass, smallClass } from "@/components/sheet/SheetText";
import { act4, images } from "@/content/ephemeral-ground";

const { hall, sheets } = act4;

const floors: ViewerPhoto[] = hall.floors.list.map(({ name, alt }) => ({ ...images[name], alt, caption: hall.floors.figure }));

const stackHeight = floors.reduce((total, { height }) => total + height, 0);

// The floors, one group so phones play them together; then her words, the models and the key plan.
const FLOORS = 0;
const TEXT = 1;
const MODELS = 2;
const KEY = 3;

/** Her p.17. In the code the floors run ground first and CSS turns them over, so they appear from the ground up. */
export default function CommunityHall({ title }: { title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const style = { "--sheet-ratio": floors[0].width / stackHeight, "--sheet-caption": "1.25rem" } as CSSProperties;

  return (
    <>
      <SheetGrid id="community-hall" title={{ act: title, sheet: sheets.hall }} titleAt="D8:E8" slow hold>
        <SheetBlock at="A1:E5">
          <h3 data-sheet-step="text" data-sheet-group={TEXT} className={headingClass}>
            {hall.zone}
          </h3>
          <h4 data-sheet-step="text" data-sheet-group={TEXT} className={`${nameClass} mt-1`}>
            {hall.title}
          </h4>
          <Lines group={TEXT} className={`${smallClass} mt-3`}>
            {hall.text}
          </Lines>
          <h4 data-sheet-step="text" data-sheet-group={TEXT} className={`${nameClass} mt-3 mb-1`}>
            {hall.form.title}
          </h4>
          <Lines group={TEXT} className={smallClass}>
            {hall.form.text}
          </Lines>
        </SheetBlock>
        <Drawing
          image={images[hall.form.image.name]}
          alt={hall.form.image.alt}
          at="A6:C8"
          figure={hall.form.image.figure}
          group={MODELS}
          sizes="(max-width: 1024px) 92vw, 24vw"
        />
        <KeyPlan
          heading={hall.keyPlan.heading}
          image={images[hall.keyPlan.name]}
          alt={hall.keyPlan.alt}
          at="D6:E7"
          figure={hall.keyPlan.figure}
          area={hall.keyPlan.area}
          group={KEY}
          sizes="(max-width: 1024px) 92vw, 16vw"
        />
        <SheetBlock at="G1:L8" className="sheet-drawing">
          <figure className="sheet-fit" style={style}>
            <div className="flex flex-col-reverse">
              {floors.map((floor, index) => (
                <button
                  key={floor.src}
                  type="button"
                  aria-haspopup="dialog"
                  data-sheet-step="callout"
                  data-sheet-group={FLOORS}
                  onClick={() => setOpen(index)}
                  className="block w-full cursor-zoom-in"
                >
                  <Image src={floor.src} alt={floor.alt} width={floor.width} height={floor.height} sizes="(max-width: 1024px) 92vw, 50vw" className="block h-auto w-full" />
                </button>
              ))}
            </div>
            <FigureCaption figure={hall.floors.figure} group={FLOORS} />
          </figure>
        </SheetBlock>
      </SheetGrid>
      <PhotoViewer photos={floors} index={open} onChange={setOpen} />
    </>
  );
}
