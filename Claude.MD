# Subhana Khan — Architecture Portfolio Website

Portfolio site for Subhana Khan, architect (Kochi, Kerala). Source material is her 46-page
landscape PDF portfolio "Selected Works 2021-26". The website must FEEL like that PDF:
same fonts, colours, paper textures and calm, architectural tone — but told as a scroll story,
not a page-flipper.

## How we work (read first)

- Build ONE section at a time. After each section: run the dev server, check it in the
  browser at desktop (1440px) and mobile (375px) widths, then stop and wait for review.
- Start every new feature in plan mode. Explain the plan in plain words before writing code.
- Do not add new dependencies beyond the stack below without asking.
- The developer knows frontend fundamentals but not design jargon. When you use a design
  or animation term, explain it in one short sentence.
- Never retype or "improve" her writing without approval. Known typos to fix (approved
  list only): "innnovation" → "innovation", "consious" → "conscious", "PLANING" → "PLANNING",
  "permanant" → "permanent", "Mangroove" → "Mangrove", "Spactial" → "Spatial".

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
| `--thesis-teal` | #6FB5B0 | Ephemeral Ground accent |
| `--sage` | #9DB58A | Landscape / masterplan accents |
| `--sand` | #E9D6B6 | Floor-plan fills |
| `--sun` | #EED98A | Hillside School accent (the sun) |

Verify exact hex values by sampling the extracted page images before finalising.

### Recurring details
- Site header mirrors the PDF header: "Portfolio - Subhana Khan" (left),
  "Selected works - 2021-26" (right), both small Nunito in terracotta.
- Paper texture background, torn-paper edges, arch-shaped image frames (thesis page 11).
- Cutout people from the cover collage (walking woman, elderly couple, children running)
  reappear across the site as small parallax figures.
- Generous white space. Nothing loud. No neon, no gradients that aren't in her work.

## Motion principles

- Calm and architectural, never flashy. ONE signature effect per page; everything else subtle.
- Easing: always ease-out style curves. Never linear for UI motion.
- Default durations 0.4–0.8s. Stagger lists by ~60–100ms.
- Animate only `transform` and `opacity` (smooth on phones).
- Respect `prefers-reduced-motion`: replace movement with simple fades.
- In the thesis "slowness" act, motion deliberately slows down (1.2–1.6s, line-by-line text).

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

No ordinary tab/button navigation between sections. Home-page previews expand into their
detail pages with a shared-element transition (the preview image grows into the page hero).

## Home page sections (build in this order)

1. **Hero** — her cover collage (grid of 12 tiles) with the name "SUBHANA KHAN". Cutout
   people sit on a separate layer and move at a different speed on scroll (parallax).
2. **About intro** — short version of "Hello! I'm Subhana" with portrait; link to /about.
3. **01 Ephemeral Ground preview** — Indian Ocean map with Great Nicobar as a glowing dot;
   on hover/scroll it begins to zoom in (teaser of the signature zoom).
4. **02 Hillside School preview** — the long site section; the yellow sun rises behind it.
5. **03 Timber Veil preview** — the exploded lamp diagram assembles itself on scroll.
6. **04 Indie Stories preview** — 6–9 hero photos in a mini masonry grid, fading up staggered.
7. **Essay teaser** — one line from the essay, link to /writing/imperfections.
8. **Footer** — "Thank you" lettering, contact (email, phone, location), CV link,
   optional "Download portfolio (PDF)" button.

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