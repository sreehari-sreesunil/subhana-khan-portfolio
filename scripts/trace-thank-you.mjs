// Traces her "Thank you" lettering into public/images/thank-you.svg. Dev-only.
// Input: assets-src/extracted/thank-you.png, an enlarged, softly blurred crop of the PDF's last page
// (the blur takes out the JPEG stair-steps; potrace then gives the edge back).
// Run with `node scripts/trace-thank-you.mjs`.
import { mkdirSync, writeFileSync } from "node:fs";
import potrace from "potrace";

const SRC = "assets-src/extracted/thank-you.png";
const OUT = "public/images/thank-you.svg";

potrace.trace(
  SRC,
  { threshold: 128, turdSize: 60, alphaMax: 1.25, optTolerance: 1.2, color: "#22302a", background: "transparent" },
  (error, svg) => {
    if (error) throw error;
    mkdirSync("public/images", { recursive: true });
    writeFileSync(OUT, svg);
    console.log(`Wrote ${OUT} (${svg.length} bytes)`);
    console.log(svg.match(/<svg[^>]*>/)?.[0]);
  },
);
