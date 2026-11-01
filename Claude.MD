# Subhana Khan — Architecture Portfolio Website

Portfolio site for Subhana Khan, architect (Kochi, Kerala). Source material is her 46-page
landscape PDF portfolio "Selected Works 2021-26". The website must FEEL like that PDF:
same fonts, colours, paper textures and calm, architectural tone — but told as a scroll story,
not a page-flipper.

## How we work (read first)

- Read docs/status.md at the start of every session; update it before every commit.
- Build ONE section at a time. After each section: run the dev server, check it in the
  browser at desktop (1440px) and mobile (375px) widths, then stop and wait for review.
- Start every new feature in plan mode. Explain the plan in plain words before writing code.
- If a CSS change doesn't show, run `npm run dev:clean` (deletes `.next`, then starts the
  dev server; Turbopack sometimes serves stale CSS).
- Do not add new dependencies beyond the stack below without asking.
- The developer knows frontend fundamentals but not design jargon. When you use a design
  or animation term, explain it in one short sentence.
- Never retype or "improve" her writing without approval. Known typos to fix (approved
  list only): "innnovation" → "innovation", "consious" → "conscious", "PLANING" → "PLANNING",
  "permanant" → "permanent", "Mangroove" → "Mangrove", "Spactial" → "Spatial",
  "Settelers" → "Settlers", "Strait of malacca" → "Strait of Malacca", "166sq.km" → "166 sq.km",
  "Bio-diversity" → "Biodiversity", "Jun'ichirō" → "Jun’ichirō", "inbuild" → "inbuilt", "Community hall" → "Community Hall",
  "veranda" → "verandah", "build structures are build" → "built structures are built",
  "six potential" → "Six potential", "Campbell bay" → "Campbell Bay",
  "Contour intrevals" → "Contour intervals". Dashes in her text: the shorter en dash (–).

## Stack

- Next.js (App Router) + TypeScript, static export where possible, deploy on Vercel
- Tailwind CSS (design tokens below live in the Tailwind theme + CSS variables)
- Motion (formerly Framer Motion) — component animations, page/shared-element transitions
- GSAP + ScrollTrigger — scroll-driven storytelling (the zoom, pinned sections)
- Lenis — smooth scrolling
- next/image for all images (AVIF/WebP, responsive sizes, lazy loading)

## Design system (taken from the PDF)

### Fonts
| Role | Font | Source |
|---|---|---|
| Headings, chapter numerals, titles | Metropolis (Medium / SemiBold / Bold) | `npm i @fontsource/metropolis` (Unlicense); copy latin woff2 files to `src/fonts`, load with `next/font/local`. The original GitHub repo is private — don't use it |
| UI labels, nav, captions, small meta text | Nunito | `next/font/google` |
| Body text, long paragraphs | Lora (Regular / Italic) | `next/font/google` |
| "Thank you" sign-off only | Script — use an image/SVG of her original lettering | — |

Exception: the hero reproduces her cover PSD, so its name and labels use Metropolis
(SemiBold / Medium / Regular) as in the PSD. Nunito is for the site header and other UI text.

Headings are often large, tight and uppercase (e.g. "EPHEMERAL GROUND"). Chapter numerals
(01, 02, 03, 04) are huge, bold Metropolis in deep green, often bleeding off the page edge.

### Colours
| Token | Hex (approx.) | Use |
|---|---|---|
| `--ink-green` | #22302A | Primary text, headings, numerals |
| `--ink-brown` | #3B2A1C | Secondary headings ("contents.") |
| `--accent-terracotta` | #9C6B4A | Meta labels, page numbers, links |
| `--paper` | #E6E1D9 | Main background (with subtle paper texture) |
| `--paper-white` | #FAF8F4 | Alternate background |
| `--thesis-teal` | #70BBB7 | Ephemeral Ground accent |
| `--sage` | #9DB58A | Landscape / masterplan accents |
| `--sand` | #E9D6B6 | Floor-plan fills |
| `--sun` | #EED98A | Hillside School accent (the sun) |

Verify exact hex values by sampling the extracted page images before finalising.

### Recurring details
- `SiteHeader` is added per page, not in the layout (`AboutIntro` renders its own `light` one).
- Site header mirrors the PDF header: "Portfolio - Subhana Khan" (left),
  "Selected works - 2021-26" (right), both small Nunito in terracotta.
- Paper texture background, torn-paper edges, arch-shaped image frames (thesis page 11).
- Cutout people from the cover collage (walking woman, elderly couple, children running)
  reappear across the site as small parallax figures.
- Generous white space. Nothing loud. No neon, no gradients that aren't in her work.

## Shared components

- Images on the scroll story need a set width (`w-full`, or a `style` width) with `h-auto`. `w-auto h-auto` is zero
  tall until the image loads, which moves everything below it after ScrollTrigger has measured the page.
- `<RevealImage>`: use for images that should wipe up as they enter view (once). Takes all
  `next/image` props, plus `wrapperClassName` for the outer box. Reduced motion: a fade. The
  hidden state is CSS under `html.js`, with a failsafe if the main bundle never runs. Don't use it
  for anything above the fold on load (it would flash in after hydration). In view and unrevealed after 2s, it reveals anyway.
  It fetches its image one screen early, and waits up to 2s for it, so a wipe doesn't open on an empty box.
- `fetchEarly(root, selector)` (`src/lib/fetch-early.ts`): call inside `useGSAP`. An image hidden by `clip-path` counts as
  off screen, so lazy loading alone would start it only once the wipe has run. This loads it one screen before arrival.
- `PhotoViewer`: full-screen viewer on a native `<dialog>`, with arrows, swipe, Escape. Takes `photos`, `index` (`null` when
  shut) and `onChange`. It stops at 3× a photo's real size rather than blur it, so originals fill the screen with no change.
- `data-cursor="enter"`: on an element that navigates when clicked, the dot grows into an
  "Enter" circle. Never put it on something that isn't clickable. Links and buttons grow the dot
  automatically. Text fields keep the native cursor. Fine pointers only, off under reduced motion.
- `Footer`: in the layout, so on every page. `site.footer.portfolioPdf` is `null` until she provides
  the file; setting a path shows the download link. `SunPath` is retired from the footer and kept in
  `/lab` for reference; its hill and building are TEMP.
- `SnapStrip`: native sideways scroller with arrows and a progress line, for wide images. It rests on each
  `[data-snap]` inside it, which must have real size (`inset-y-0 w-px`): Chrome ignores empty snap targets.
- `createCamera` (`src/lib/camera.ts`): one camera, any number of stops, each with an optional `rotation`; `project(point)`
  says where a map point falls in the frame, for layers kept on the map. `map-osm.svg` is shared by home and
  the project page, so its credit ("Coastline © OpenStreetMap contributors") must show wherever the map does.
- Living sheet (`src/components/sheet/`, thesis Acts 1–3 except 3.3, and Act 4): `SheetGrid` is a full-screen sheet, 12×8 from `lg`,
  4 columns below, with its own paper and grain, down to 700px tall (`.sheet` type sizes use `min(vw, svh)`). Inside it,
  `SheetBlock`, `Drawing`, `DrawingRow`, `KeyPlan`, `Callout` and `Inhabitant` take cells (`at="A1:C8"`, the code's way of placing
  things; the page shows only tick marks) and `phone` spans. Text goes beside a drawing, marked with
  `data-sheet-step="text"` and `data-sheet-group`. Each group reveals drawing → callout → text; people come last.
  `slow` is Act 2's pace, `hold` keeps the sheet on screen for it (desktop with motion). `TitleBlock` shows scale and
  north only where her drawing has them; never invent them. `SheetBlock type="stage-window"` is a transparent hole in
  the paper so the camera stage shows through; it needs a `fallback` for phones, and its own label carries the map credit.
  `late` opens one only at `LATE_WINDOW`, where the sheet is held still (4.2: the stage's plan lands exactly under it).
  `onGroupStart` lets a sheet reveal something outside itself. Inside SheetGrid's triggers GSAP scopes selector strings to
  the sheet, so look such targets up with `document.querySelectorAll`. `ZoneShapes` (1.4) is generated by
  `scripts/trace-zones.py` into `src/content/ephemeral-zones.ts`; don't edit that file by hand.
- `/lab`: dev-only workbench (404 in production). Try shared components there first.

## Paper texture and grain

A subtle animated grain over every section, so the screen feels like her paper pages
(inspired by antonyraphy.com's moving noise background, but softer and warmer).

- `scripts/generate-grain.mjs` generates all tiles into `public/textures`. Do NOT animate an
  SVG `feTurbulence` filter per frame (too expensive).
- Fibre: `.paper-fibre` on coloured sections only (grey-blue, paper-coloured), never on pure
  white. Static; `paper.png` is generated, modelled on her page 01 paper.
- Grain: every section is `relative` and ends with `<Grain surface="colour" />` (soft-light,
  `grain.png`) or `<Grain surface="white" />` (multiply, `grain-white.png`), above its images.
  A new section without one has no grain. Opacity: `--grain-opacity` (0.12).
- Animate it by jumping the tile to random offsets with a CSS `steps()` keyframe
  animation at ~8–10 changes per second ("film grain" flicker), using `transform` only.
- Reduced motion: keep the grain, stop the animation (static paper texture).
- Must not cost noticeable performance on phones; check in DevTools Performance.

## Motion principles

- Calm and architectural, never flashy. ONE signature effect per page; everything else subtle.
- Easing: always ease-out style curves. Never linear for UI motion.
- Default durations 0.4–0.8s. Stagger lists by ~60–100ms.
- Animate only `transform` and `opacity` (smooth on phones).
- Respect `prefers-reduced-motion`: replace movement with simple fades.
- Never branch initial render output on reduced motion (causes hydration mismatches). Use
  MotionConfig reducedMotion='user' for Motion, CSS motion-safe: variants for layout, and
  gsap.matchMedia for GSAP.
- Reveal cap: a whole sheet's reveal finishes within 3s in the thesis "slowness" act and 2s elsewhere. Sequences such as
  2.7's axes and quadrants use the same 3s. Phones reveal one group at a time, so the cap there is 2s (slow) or 1.2s per
  group. `SheetGrid` builds the timeline, then squeezes it to fit. Slowness comes from reveal ORDER, not duration.
- Every image (`next/image`, `RevealImage`, images inside a `SnapStrip`) must reserve its space
  before it loads: a set `width`/`height`, or `fill` on a parent sized with `aspect-ratio`. Never
  pair `w-auto` with `h-auto` — the box is zero tall until the image loads, which shifts everything
  below it after ScrollTrigger has measured the page. As a safety net, `PageTransition` watches the
  visible `main` with a `ResizeObserver` and calls `ScrollTrigger.refresh()` after 150ms of quiet — a
  backstop, not a substitute for reserving space.

## Thesis sheet rules

Every living sheet follows these. Anything short of them is reported, not hidden.

- No magnification callouts. `Callout` only links a drawing to a DIFFERENT, more detailed drawing of hers (masterplan →
  cluster → unit in Act 4), never a crop of the same source.
- Key plans: on sheets showing part of the site (3.5 now, Act 4 zones later), `KeyPlan` shows her plan small with the
  area boxed, as on her pp.18 and 22. Not in Act 2.
- Figure numbers: every drawing or image gets "Fig. <act>.<section>.<n> — <title>" (small `font-ui`), its credit beneath.
  The numbers are generated in order in the content file by `figures(section)`. Use her titles where they exist.
- Honest furniture: keep the title block (project, act, her original sheet number). Quiet tick marks, no A–L / 1–8 letters.
  `Inhabitant` only inside sections, elevations and renders at drawing scale, never beside a diagram.
- Composition: each sheet has EITHER one clear hero (≥ ~1.5x the area of the next largest element) OR a deliberate series
  of equals (like her p.23). Never crop her drawings to get there. Text tops and edges line up with drawing
  edges; text columns about 45–70 characters; about 5 elements a sheet; coverage about 50–70%, not 100%.

## Site map

| Route | Content (PDF pages) |
|---|---|
| `/` | Home — hero, about intro, four chapter previews, essay teaser, footer |
| `/about` | Intro (p.01) + CV (p.02) |
| `/work/ephemeral-ground` | Thesis, scroll story in 4 acts (p.06–24) |
| `/work/ephemeral-ground/sheets` | "View all sheets" — file-system style browser of the original jury sheets |
| `/work/hillside-school` | Project 02 (p.25–32) |
| `/work/timber-veil` | Project 03 — product design (p.33–36) |
| `/photography` | Indie Stories — masonry grid with filters (p.37–43 + extra photos) |
| `/writing/imperfections` | Essay "Are we scared of imperfections?" (p.44) |

Internal links use `TransitionLink` (torn-paper sheet). A new page needs a `metadata.title` of its own
(the route announcer only speaks when the title changes) and an entry in `site.pageNames`.

No ordinary tab/button navigation between sections. Home-page previews expand into their
detail pages with a shared-element transition (the preview image grows into the page hero).

## Home page sections (build in this order)

0. **Preloader** — year counter 2021–2026, first home load per session. Its `<head>` script tags
   `<html>` so CSS hides it on repeat visits; the hero entrance waits on `usePreloaderDone()`.
   A CSS failsafe clears it at ~6s if its script dies; keep anything hidden until JS runs in that rule.
1. **Hero** — her cover collage (grid of 12 tiles) with the name "SUBHANA KHAN". Cutout
   people sit on a separate layer and move at a different speed on scroll (parallax).
2. **About intro** — short version of "Hello! I'm Subhana" with portrait; link to /about.
3. **01 Ephemeral Ground preview** — Indian Ocean map with Great Nicobar as a glowing dot;
   on hover/scroll it begins to zoom in (teaser of the signature zoom).
4. **02 Hillside School preview** — the long site section; the yellow sun rises behind it.
5. **03 Timber Veil preview** — the exploded lamp diagram assembles itself on scroll.
6. **04 Indie Stories preview** — 6–9 hero photos in a mini masonry grid, fading up staggered.
7. **Essay teaser** — one line from the essay, link to /writing/imperfections.
8. **Footer**: rotary dial (0484), email always in plain text, "Thank you" lettering, About / CV links,
   optional "Download portfolio (PDF)" button.

## Patterns borrowed from the reference site (antonyraphy.com)

Borrow STRUCTURE only. Never his personality (spy theme, dark tech feel) or his content.
Her site stays calm, warm and papery.

1. **Chapter preview cards** (home sections 3–6): small code label, then a bold uppercase
   headline written as a question or claim, then a 1–2 sentence story. Use her own words.
   Example:
   - Label: `_EPHEMERAL GROUND_01`
   - Headline: `WHAT IF A SETTLEMENT LEFT A PLACE BETTER THAN IT FOUND IT?`
   - Story: "A neighbourhood of 1,000 on Great Nicobar, designed so its daily life is its ecology."
   Store label / headline / story per project in `src/content/`. Draft headlines for
   02–04 from her texts and get approval before using them.
2. **Art direction per screen size**: landscape sheets are unreadable on phones. Each key
   image gets a desktop (landscape) version AND a portrait crop of its best detail for
   phones, switched with `<picture>`/media-aware image sources. Add a `mobile` image field
   to the content types.
3. **Info strip in the site header**: extend the PDF-style header to e.g.
   "Kochi, Kerala · Selected Works 2021-26 · Open to opportunities". Text lives in `site.ts`.
4. **One signature interaction in the footer/contact**: the rotary dial (dial 0484, Kochi's
   area code). Decided by the developer. It must stay HER paper collage, never a photoreal phone
   or a copy of his. Contact is never gated: the email is always in plain text below it.
5. **Photography preview on home**: a drag-to-browse slider (with gentle parallax inside
   each image) as the home preview; the full masonry grid stays on /photography.

## Ephemeral Ground — scroll story

Signature effect: ONE continuous zoom from ocean to a single home, driven by scroll:
Indian Ocean map → Great Nicobar island → site → masterplan → residential cluster → family unit plan.
Each act pauses (pins) at its zoom level while its content plays.

| Act | Question | PDF pages |
|---|---|---|
| 1. The island | Why here, and what is at stake? | 07–08 |
| 2. The idea | What is slowness in design? (research) | 23–24, then 11–12 |
| 3. The ground | Where exactly? | 09–10 |
| 4. The settlement | What did she design? | 13–22 |

Other motion in this page: contour lines draw themselves in (SVG stroke animation), the
design-program bubble diagram (p.13) connects up node by node.

A "View all sheets" button opens the file-system view: folders per act, files are the
original sheets as full images, click to open a zoomable viewer.

## Photography page

- Masonry (Pinterest-style) grid, 30–40 curated photos.
- Filters: Streets & People · Interiors · Architecture · Graphic work.
- Images fade up with a stagger as they enter; click opens a fullscreen viewer with
  keyboard/swipe navigation.

## Assets

- Never ship the PDF to the site (except an optional compressed download, ≤25MB).
- Raw extracted images live in `/assets-src` (not deployed). Processed web images in `/public/images`.
- Prefer original image files over PDF page renders. Full jury sheets: render at ~2400px wide.
- Target 150–400KB per image; next/image generates responsive sizes.
- All text is real HTML, never text baked into images (except her script "Thank you").
- Third-party images (maps, news clippings, architect portraits, published photos) stay,
  with a credit line in the caption.

## Content

Store page content as typed data in `/content` (e.g. `content/ephemeral-ground.ts`),
not hard-coded in components, so text and images can be swapped without touching layout.

## Before launch

- Hero tiles 01, 07–10, 12, 13: upgrade if Subhana sends original photos (current crops
  from cover.psd are ~420px per cell, below the 2× target).
- Ephemeral Ground credits: replace every "Source to confirm" in `ephemeral-ground.ts`; they show on the page.
- Site photos (3.5): the 12 crops are only 174–195px tall, so they look soft and the viewer stops at 3×. Replace with
  originals, and confirm their credits ("Photographer to confirm") and the figure titles written for them.
- Replace About portrait with original (current one is a TEMP cutout from the flattened
  PDF page, 376×621px).
- Phone number: only add if Subhana confirms.
