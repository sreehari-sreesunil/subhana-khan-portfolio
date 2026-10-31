"use client";

import { useState } from "react";
import PhotoViewer from "@/components/PhotoViewer";
import { images } from "@/content/ephemeral-ground";

const photos = [images["ground/site-5"], images["ground/site-4"], images["ground/infra-3"]].map((image, i) => ({
  ...image,
  alt: "",
  caption: `Sample photo ${i + 1}`,
  credit: "Sample credit",
}));

export default function ViewerDemo() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <button type="button" className="font-body text-accent-terracotta underline" onClick={() => setOpen(0)}>
        Open the photo viewer
      </button>
      <PhotoViewer photos={photos} index={open} onChange={setOpen} />
    </>
  );
}
