"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import PhotoViewer, { type ViewerPhoto } from "@/components/PhotoViewer";
import { FigureCaption } from "@/components/sheet/Drawing";
import KeyPlan from "@/components/sheet/KeyPlan";
import SheetBlock from "@/components/sheet/SheetBlock";
import SheetGrid from "@/components/sheet/SheetGrid";
import { act3, images } from "@/content/ephemeral-ground";

const { infrastructure, photos: sitePhotos, sitePhotosSheet, keyPlan } = act3.context;

const groupsOfPhotos = [infrastructure, sitePhotos];

const viewerPhotos: ViewerPhoto[] = groupsOfPhotos.flatMap(({ list, credit }) =>
  list.map((photo) => ({ ...images[photo.name], alt: photo.alt, caption: photo.figure, credit })),
);

// Three columns of four, with each group's heading where it begins.
const COLUMNS = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
];

function GroupHeading({ title, credit }: { title: string; credit: string }) {
  return (
    <div className="sheet-masonry-heading">
      <h3 data-sheet-step="text" data-sheet-group={0} className="font-heading text-[length:var(--sheet-name)] leading-tight font-semibold text-ink-green">
        {title}
      </h3>
      <p data-sheet-step="text" data-sheet-group={0} className="sheet-caption font-ui">
        {credit}
      </p>
    </div>
  );
}

/** 3.5: her two photo strips as a masonry sheet. Every photo opens full screen. */
export default function SitePhotos({ act }: { act: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const startOfSite = infrastructure.list.length;

  return (
    <>
      <SheetGrid id="site-photos" title={{ act, sheet: sitePhotosSheet }}>
        <SheetBlock at="A1:I8" className="sheet-masonry">
          {COLUMNS.map((column) => (
            <div key={column[0]} className="sheet-masonry-column">
              {column.map((index) => {
                const photo = viewerPhotos[index];
                const ratio = photo.width / photo.height;
                return (
                  <div key={photo.src} className="contents">
                    {index === 0 && <GroupHeading title={infrastructure.title} credit={infrastructure.credit} />}
                    {index === startOfSite && <GroupHeading title={sitePhotos.title} credit={sitePhotos.credit} />}
                    <figure className="sheet-photo" style={{ "--sheet-ratio": ratio, flexGrow: 1 / ratio } as CSSProperties}>
                      <button
                        type="button"
                        aria-haspopup="dialog"
                        data-sheet-step="drawing"
                        data-sheet-group={index}
                        onClick={() => setOpen(index)}
                        className="sheet-photo-button"
                      >
                        <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1024px) 46vw, 25vw" className="object-cover" />
                      </button>
                      <FigureCaption figure={photo.caption ?? ""} group={index} />
                    </figure>
                  </div>
                );
              })}
            </div>
          ))}
        </SheetBlock>
        <KeyPlan
          heading={keyPlan.heading}
          image={images[keyPlan.image.name]}
          alt={keyPlan.image.alt}
          at="J1:L4"
          figure={keyPlan.figure}
          credit={keyPlan.image.credit}
          area={keyPlan.area}
          group={viewerPhotos.length}
          sizes="(max-width: 1024px) 92vw, 24vw"
        />
      </SheetGrid>
      <PhotoViewer photos={viewerPhotos} index={open} onChange={setOpen} />
    </>
  );
}
