# Ephemeral Ground project page: plan

**Status:** approved. The decisions below are final unless noted; open items wait on Subhana.

## Decisions

- **One pinned mechanism only: the camera stage.** Everything else that moves sideways is a native
  horizontal-scroll strip.
- **Sticky act navigator** (01 THE ISLAND · 02 THE IDEA · 03 THE GROUND · 04 THE SETTLEMENT), built with
  the Opening.
- **Text from pp.07–22:** OCR the crops with Tesseract, then proofread line by line against the images.
  Every such block is marked `// OCR, proofread` in the content file.
- **Contours drawing in** moved to the end, as optional.
- **Zoom:** scroll-scrubbed.
- **Identifiable photos of Jarawa and Shompen people are left out,** and those sources are cited in text.
  Hut photos without identifiable people are fine, with credit.
- **Her text is kept exactly for now,** including "Shared Territories", "Bay of Bengal" and the tree figures.
- **"BUILT AREA:" line is dropped.**
- **Unit plan:** a redrawn SVG is acceptable, with her check.
- **"View all sheets"** at 1753px is fine for v1.
- **Numerals follow the PDF** (01).

## Context

`/work/ephemeral-ground` is still a stub. This plan turns her thesis (printed pp.06–24) into the 4-act
scroll story from `CLAUDE.md`, ending in one continuous zoom from ocean to a single home.

**The main finding changes the approach:** the sources are much thinner than `CLAUDE.md` assumes.

- `portfolio.pdf` has **no text and no vectors**. Every printed page is one flattened JPEG, 1753×1240.
- `ug thesis.psd` has 21 artboards, but **only 3 hold real work** (pp.05–06, 23, 24). The rest are empty.
- So pp.07–22 exist only as 1753px JPEGs. The masterplan, cluster and unit plans the zoom ends on are
  the weakest assets. See "Needed from Subhana".

**Do not use from the PSD:**
- Hidden `Screenshot 2026-09-01 130138` (Artboard 2): **another person's CV with personal contact details**.
- Hidden `Layer 83` (Artboard 19): a page from **another person's portfolio**.
- Other hidden layers aren't thesis work: Layer 18 (colour swatch), Layer 36 (lit windows), Layer 53
  (speech bubble), Layer 23 (the cover's cutout people), Layer 68 (Timber Veil photo).
- `Gemini_Generated_Image…` (Artboard 11): an **AI-generated** Timber Veil render with the Gemini mark.
  It belongs to project 03, but matters for that page (open question 9).

---

## 1. Page map

The PDF is out of order: **printed 17–18 are PDF p.11; printed 19–20 are PDF p.10.** L/R = half of the PDF page.

| Printed | PDF | Contains | Act |
|---|---|---|---|
| 05 | 4 L | Numeral 01; "EPHEMERAL GROUND"; project facts; left half of isometric plan | Opening |
| 06 | 4 R | "PROJECT BRIEF" text; right half of isometric plan | Opening |
| 07 | 5 L | Map strip (Indian Ocean, Malacca locator, 2 red circles); archipelago text; "Strait of Malacca" text; "Introduction" (Patai Takaru's people collage + text); "Pattern of dwelling" photo strip; "The Great Nicobar Development Proposal" (zone map, scale box, 4 icon columns) | 1 |
| 08 | 5 R | "Lessons from earlier interventions" (text, photo collage); statistics table + 3 island maps; four columns: Bio-diversity loss, Leatherback Turtle, Ecological Fragility, Population influx; images: "9 Lakh Trees" graphic, heat map, port map, drawn section, BBC clipping | 1 |
| 09 | 6 L | 3 island maps (tribal/revenue/national park; project land; land use); land-analysis text; hand-coloured settlements strip (Campbell Bay … Shastri Nagar) | 3 |
| 10 | 6 R | Infrastructure photo strip; contour site plan + site data + legend; transect text; site section; site context map + satellite inset; site photo strip | 3 |
| 11 | 7 L | Arch collage (whale, turtle, tree, hands) + key paragraph; Terrain / Slope Ratio / Accessibility isometric diagrams | 2 |
| 12 | 7 R | "STRATEGIES": full teal page, 4 quadrants (Defence, Environment, Economy, Social), ~13 sketches + text, inset island | 2 |
| 13 | 8 L | Poem-like opening text + collage; "Planing type" (forest aerial, cluster diagram); isometric model; "Design program" bubble diagram | 4 |
| 14 | 8 R | "Tsunami resilient design": tower render + text; zoning plan + legend | 4 |
| 15 | 9 L | "Masterplan": text, full colour plan, numbered key (1–10) | 4 |
| 16 | 9 R | 8 strategies (sketch + text); long labelled site section | 4 |
| 17 | 11 L | "Community zone / Community hall": text, form-development models, 5 stacked floor plans | 4 |
| 18 | 11 R | Community kitchen: 2 floor plans, text, key plan, elevation | 4 |
| 19 | 10 L | "Residential zone": zone plan + text, hut photos, unit plans (family, smaller, apartment), apartment section | 4 |
| 20 | 10 R | Residential and tourist cluster plans, notes, tiny hand sketch, street elevation | 4 |
| 21 | 12 L | "Tourism zone": Visitor's Center plan, text, materials, section | 4 |
| 22 | 12 R | "Cultural center": plan, text, key plan, Jarawa news clipping + text, section | 4 |
| 23 | 13 L | "What is slowness in design?"; 4 philosopher arches; 6 neuroscience tiles | 2 |
| 24 | 13 R | "Case studies" (Brion Cemetery + a brick building); "Application" (4 of her renders) | 2 |

---

## 2. Asset inventory

**Test:** displayed width in CSS px at 1440 needs ≥1× source pixels; 2× is the target. Sizes marked ≈ are measured from the page.

| Asset | p. | Best source | Pixels | Display | Verdict |
|---|---|---|---|---|---|
| Ocean, island map | 07 | `map-osm.svg` (Natural Earth, with the Nicobars from OpenStreetMap, softened) | vector | full screen | Good |
| Isometric plan | 05–06 | PSD Layer 93 | 10420×1937 | full width | **Excellent** |
| Philosopher arches | 23 | PSD `Atmosphere` | 1957×1329 | 1100 | Good |
| Neuro tiles (6) | 23 | PSD Layers 99–114 | ≈460×500 each | 230 | Good |
| Case-study strips | 24 | PSD Line 4 / Layer 120 | 2152×683, 1549×530 | 900 | Good |
| Incremental housing render | 24 | PSD Layer 121 | 1340×740 | 650 | Good |
| Library / water renders | 24 | Smart objects | **1072×598** embedded | 500 | OK at 1× only |
| Hall / residential renders | 24 | Smart objects | **500×598** embedded | 300 | OK at 1× |
| Masterplan | 15 | PDF crop | ≈1650×780 | 1200+ | **1× at best; zoom target** |
| Contour site plan | 10 | PDF crop | ≈1500×700 | 1100 | 1× |
| Tsunami zoning plan | 14 | PDF crop | ≈1600×730 | 1100 | 1× |
| Residential zone plan | 19 | PDF crop | ≈760×1050 | 700 | 1× |
| Cluster plans (2) | 20 | PDF crop | ≈620×640 each | 800 | **Too small for the zoom** |
| **Family unit plans** | 19 | PDF crop | **≈270×220** | 900 | **Unusable: redraw or get originals** |
| Hall floor plans | 17 | PDF crop | ≈1000×1000 | 800 | OK; small labels soft |
| Kitchen, Visitor's, Cultural plans | 18, 21, 22 | PDF crop | ≈1000×700 each | 800 | OK |
| Arch collage | 11 | PDF crop | ≈650×850 | 450 | OK |
| Terrain diagrams (3) | 11 | PDF crop | ≈830×320 each | 600 | OK |
| Strategy sketches | 12 | PDF crop | ≈300×200 each | 300 | 1×, JPEG noise on teal |
| Bubble diagram | 13 | **Vector: we draw it** | n/a | 1000 | Good, needed for the animation |
| 8 strategy sketches | 16 | PDF crop | ≈300×200 each | 280 | 1× |
| Long site section | 16 | PDF crop | ≈1700×300 | full width | Soft at full width |
| Tower render | 14 | PDF crop | ≈1030×350 | 800 | OK |
| Street elevation | 20 | PDF crop | ≈1400×280 | full width | Soft |
| Settlements strip | 09 | PDF crop | ≈1400×300 | full width | Soft |
| Site photos | 10 | PDF crop | ≈500×300 each | 400 | OK |
| Contour lines (for drawing in) | 10 | Trace from PDF crop | vector | n/a | See section 4 |
| **"View all sheets"** | all | PDF pages | **1753×1240** | zoom viewer | **Below the 2400px goal** |

### Needed from Subhana

**Essential** (the zoom can't end well without these):
1. Family unit plans (p.19), as source files.
2. Residential and tourist cluster plans (p.20).
3. Masterplan (p.15), ideally with plan layers separate.

**Strongly wanted:**
4. Original `ug thesis` PSD or InDesign/PDF with images embedded, since this PSD has lost pp.07–22.
5. A vector or high-resolution PDF export of the jury sheets, for "View all sheets" at 2400px.
6. Site plan with contours (p.10) and tsunami zoning (p.14).
7. Originals for her p.24 renders (`library`, `water element`, `community hall`, `prospect and refugee`).
8. Her site photos (p.10) at full size, and confirmation they're hers.

**Found while extracting (step 1):**
9. Her text sits directly on the artwork on the tourist cluster plan and the street and kitchen elevations (pp.18, 20). The tourist plan is cropped to avoid it, so it loses its right side; the elevations still carry it until clean versions arrive.
10. The settlements strip (p.09) is cropped to avoid baked text, so Campbell Bay's circle is cut. A clean version would restore it.
11. Is the p.07 Nicobarese collage safe to use? It's held back because a person in it may be Shompen.
12. `idea/photo-strip` (p.23) has baked-in text ("Why current development fails?"). A clean version would let it be real HTML.

13. 3,00,000 vs 300,000 (pick one style).
14. Sentinelese* and starred figures: what do the asterisks refer to?
15. "Humnn-place relationship" is a typo baked into the Rosa arch (p.23). A corrected image would fix it.

**Fallback if unavailable:** redraw unit plans as SVG from the p.19 crop, needing her check. Cluster plans stay at about 1×, shown smaller, with no deep zoom.

---

## 3. Text

All 47 editable text layers are on three artboards. Everything else must be **typed from the images by hand**.

| Printed | Where the text lives |
|---|---|
| 05–06 | **PSD** (5 blocks: facts, title, brief) |
| 23 | **PSD** (25 blocks) |
| 24 | **PSD** (17 blocks) |
| 07–22 | **PDF image only** |

- All goes into `src/content/ephemeral-ground.ts` as typed data, with `image` and `mobile` fields per CLAUDE.md.
- **pp.07–22:** OCR the crops with Tesseract, proofread line by line against the images, and mark each block `// OCR, proofread`. Raw OCR stays in `assets-src`.
- Approved typos only: "PLANING", "Spactial", "Mangroove", "consious", "innnovation", "permanant".
- Any others get listed for approval, as on `/about`. Already seen: "residencts" (p.05), "inbuild" (p.24).
- Labels inside diagrams stay in the image where unavoidable, but key content (legends, the masterplan key) becomes HTML.

---

## 4. Section-by-section design

### How the camera works

- **Reuse the home camera.** `EphemeralGroundPreview.tsx` already has the maths: `placeCamera`, log scale `DEPTH ** zoom`, `xPercent`/`yPercent` on one world, `force3D: false`. Extract it into a shared helper so both use one implementation.
- **Reuse the data:** `map-osm.svg` (1000×654), `site.target` (590, 282.96), `site.widthUnits` (10) from `src/content/home.ts`.
- **One fixed stage** behind the content, full-screen. Acts scroll over it; the camera moves between named stops.
- **Scroll-scrubbed** (`scrub: 0.6`, reversible), per CLAUDE.md. The home preview is autoplay; this difference is deliberate.
- **It is the only pinned or sticky scroll mechanism on the page.** The act navigator is sticky chrome, not a scroll effect. No other section pins.

**Zoom stops** (full-width stage, scale relative to the whole map):

| Stop | Scale | Shows | Where |
|---|---|---|---|
| Ocean | 1× | `map-osm.svg` | Start of Act 1 |
| Island | ≈24× | Great Nicobar fills the screen | End of Act 1, held through Act 2 |
| Site | ≈80× | Site outline on the coast | Act 3 |
| Masterplan | ≈80× | Plan fades in, map fades out | Start of Act 4 |
| Cluster | ×5 | Residential cluster | Act 4 |
| Unit | ×6 | Family unit plan | End of Act 4 |

- **Second world after the masterplan:** at the masterplan stop the camera resets to a new world with the masterplan at 1×, hidden by the crossfade. Without this, the unit stop needs about 2400×.
- **Use the p.15 flat plan, not the isometric,** from the site stop on. Its sea is on the right, so it sits correctly on the real east coast, which the isometric can't (home shows it unmirrored, as you asked).
- **Scale is exaggerated,** as on home: 10 units, about 47× true size. True scale would need about 4700×.
- **Continuing from home:** home ends on the isometric plan, so the Opening shows that same plan at the same size. The sheet lifts and the reader appears to arrive at the same object. Act 1 then begins back at the ocean.

### Act navigator

A small sticky bar: **01 THE ISLAND · 02 THE IDEA · 03 THE GROUND · 04 THE SETTLEMENT**.
- Shows the current act; click jumps to it via Lenis (`scrollToLink` in `PageTransition.tsx` already does this for #hash links).
- Each act gets an id, so `#act-1` to `#act-4` are linkable. Keyboard focusable, `aria-current` on the active act.
- Hidden during the Opening. Reduced motion: jumps instantly.

### Horizontal strips

Wide images use one shared native strip: `overflow-x: auto` with `scroll-snap-type: x`, for swipe and trackpad.
A visible affordance (a sliver of the next image, plus a small "drag / swipe" label). Keyboard scrollable. Used in 2.4, 3.2 and 4.6.

### Opening (pp.05–06)
- **Layout:** big numeral 01 bleeding off, title, facts list, isometric plan full width, brief text.
- **Assets:** PSD Layer 93 (2800px web version exists).
- **Motion:** brief text fades up line by line after the sheet leaves.

### Act 1: The island (07–08), "Why here, and what is at stake?"
- **1.1 Ocean.** Full-screen map, archipelago text beside it. *Motion: the zoom to the island begins (signature).*
- **1.2 Strait of Malacca.** Text card over the held map; her locator as an inset. *Motion: inset fades up.*
- **1.3 The people.** Patai Takaru's people collage + text; dwelling photo strip. *Motion: collage parallax, gentle.*
- **1.4 The proposal.** Zone map, scale figures as real text, 4 icons. *Motion: numbers fade up staggered, no count-up.*
- **1.5 What's at stake.** Four columns; each one image. *Motion: `RevealImage` wipe per column.*
- **1.6 Lessons.** Text, table as HTML. *Motion: table rows reveal ~60ms apart.*

### Act 2: The idea (23–24, then 11–12), "What is slowness in design?"
Camera parked at the island, dimmed behind paper. See section 5.
- **2.1 The question.** Her heading alone on a screen, the walking figure. *Motion: figure crosses as you scroll.* The stage is shared by Acts 1 and 2 (`CameraStory`), so the paper fades over the parked camera; the walker and tree live on the stage on desktop, so nothing else needs to pin.
- **2.2 Philosophers.** 4 arches, one at a time. *Motion: `RevealImage` wipe, slow.*
- **2.3 Neuroscience.** 6 tiles. *Motion: slow stagger.*
- **2.4 Case studies.** Strips with short captions. *Native horizontal strip; no pin.*
- **2.5 Application.** 4 renders + text. *Motion: line-by-line text.*
- **2.6 Back to the island.** Arch collage + key paragraph; terrain diagrams. *Motion: the three diagrams stack in.* The paper lifts here, so these are torn cards over the island, as in Act 1.
- **2.7 Strategies.** Teal page as HTML over her sketches. *Motion: quadrants open from the centre axes.*

### Act 3: The ground (09–10), "Where exactly?"
- **3.1 Land analysis.** 3 island maps + text over held camera. *Motion: maps crossfade in place.*
- **3.2 The settlements.** Hand-coloured strip. *Native horizontal strip; no pin.*
- **3.3 The site.** Camera to the site stop; outline draws on the coast (reuse the home boundary). *Motion: signature zoom continues.*
- **3.4 Contours.** Contour site plan, site data as text. *Motion: `RevealImage` for now.* Optional later: contour lines drawing in (last build step).
- **3.5 Infrastructure, section, photos.** *Motion: `RevealImage`.*

### Act 4: The settlement (13–22), "What did she design?"
- **4.1 Opening text.** Her "Everything that lives, passes…" alone. *Motion: line-by-line.*
- **4.2 Masterplan.** Zoom stop; key as HTML linked to numbers. *Motion: signature zoom continues; hovering a key item highlights its number.*
- **4.3 Design program.** SVG bubble diagram. *Motion: connects node by node (CLAUDE.md).*
- **4.4 Tsunami.** Render, text, zoning. *Motion: the three defence layers fade in order.*
- **4.5 Eight strategies.** 2×4 grid. *Motion: stagger.*
- **4.6 Site section.** Labelled. *Native horizontal strip; no pin.*
- **4.7 Community zone (17–18).** Plans + text. *Motion: hall floors stack in order.*
- **4.8 Tourism and culture (21–22).** Plans + text. *Motion: `RevealImage`.*
- **4.9 Cluster, then home (19–20).** Zoom to cluster, then the family unit. *Motion: the zoom ends here, and the page rests.* Then elevation and "View all sheets".

**One signature effect per page:** the zoom. Everything else stays small.

---

## 5. Act 2: slowness

The reader should feel the page calm down.

- **Longer scroll per idea:** sections about 1.5× the height of Act 1, so the same scrolling reveals less.
- **Slow timings:** 1.2–1.6s per CLAUDE.md, text line by line (reuse the `SplitText` approach in `AboutIntro.tsx`).
- **One thing at a time:** no grids appearing at once; arches one per screen.
- **Stillness:** camera parked, no parallax, more white space.
- **Motif:** her walking figure and footprints (PSD Layer 116) cross as you scroll, and the lone tree (Layer 115).
- **Never lock scrolling.** It only needs more distance. Reduced motion: plain fades, same order.

---

## 6. Third-party images and credits

A credit line isn't permission, and a public site is different from a jury sheet. Suggested credits below; items marked **replace** or **ask** need a decision.

| Image | p. | Suggested credit | Note |
|---|---|---|---|
| Indian Ocean map | 07 | Map data © Google | **Replace** with our `map-osm.svg` |
| Malacca locator map | 07 | Source to confirm | Ask, or redraw |
| Development proposal map | 07 | Based on NITI Aayog, *Holistic Development of Great Nicobar Island* | Confirm source |
| Tribal/forest map | 09 | Dr M. Chandi, ANTRI RAC, with A&N Forest Dept GIS cell, 2018 | Printed on the map |
| Project land map | 09 | NITI Aayog, *Holistic Development of Great Nicobar Island* | Printed on the map |
| Land use map | 09 | Source to confirm | Likely same document |
| Statistics table + island maps | 08 | Source to confirm | Rebuild table as HTML |
| "Over 9 Lakh Trees" graphic | 08 | Source to confirm (news graphic) | Text says 8.5 lakh |
| Land-surface heat map | 08 | Source to confirm | |
| Port map | 08 | Source to confirm | |
| BBC clipping | 08 | Subir Bhaumik, BBC News, 16 May 2006 | Cite as text; **left out** (shows a Jarawa person) |
| Jarawa clipping | 22 | Appears to be The Guardian; confirm | Cite as text; **left out** |
| Photos of indigenous people | 07, 08, 22 | Sources to confirm | **Left out** if identifiable Jarawa or Shompen people |
| Dwelling photos | 07, 19 | Sources to confirm | Likely archival |
| Rosa, Pallasmaa, Tanizaki, Zumthor portraits | 23 | Photographer to confirm | Collaged |
| Buildings in arches | 23 | Architect and photographer to confirm | One appears to be Villa Savoye |
| Neuroscience tiles | 23 | Sources to confirm | |
| Brion Cemetery | 24 | Carlo Scarpa; photographer to confirm | Named in her text |
| Brick building, handle, seat | 24 | Appears to be Säynätsalo Town Hall, Alvar Aalto; confirm | Not named on the page |
| Satellite inset | 10 | Imagery © provider to confirm | |
| Site, infrastructure photos | 10 | Hers? | Confirm |

**Decided:** identifiable photos of Jarawa and Shompen people are left out, and those sources are cited in text. Hut photos without identifiable people stay, with credit.

---

## 7. Mobile and art direction

- **No camera on phones.** Each stop becomes a static framed image with a crossfade as it enters. Act order and text stay the same. Reduced motion uses this too.
- **Sticky, scrub and pins are desktop only** (≥768px).
- **Every wide image gets a `mobile` crop** via `<picture>`, per CLAUDE.md.

| Image | Phone crop |
|---|---|
| Isometric plan | Residential half, portrait |
| Masterplan | Housing and lake, portrait |
| Contour plan | Lake and contours, portrait |
| Tsunami zoning | Coastal half, portrait |
| Site section | 3 crops, swipe sideways |
| Street elevation, settlements strip | Sideways swipe, with labels as text |
| Strategies (p.12) | One strategy per card, stacked |
| Philosopher arches | One arch per screen |
| Bubble diagram | Rearranged SVG for portrait |
| Floor plans | Fit width, tap for the zoom viewer |

Text in diagrams will be too small on phones, so it moves to HTML captions.

---

## 8. Build order

Each step is one reviewable piece, checked at 1440px and 375px, then stop for review.

1. **Assets and content skeleton:** extract PSD layers, make crops, create `ephemeral-ground.ts`. *Check: all images load in `/lab`.*
2. **Shared camera:** extract from the home preview with no behaviour change. *Check: home stress tests still pass.*
3. **Opening and act navigator.** *Check: lands from home without a jump; navigator tracks and jumps.*
4. **Act 1 zoom only:** ocean to island, scroll-scrubbed. *Check: reverses cleanly, fixed stage.*
5. **Act 1 content** (1.1–1.6). *Check: OCR proofread.*
6. **Act 2 text and arches** (2.1–2.3). *Check: pacing by hand.*
7. **Act 2 rest** (2.4–2.7), with the shared horizontal strip.
8. **Act 3:** site zoom and outline. *Check: outline sits on the coast.*
9. **Act 4 masterplan stop,** then the key. *Check: flat plan aligns with the coast.*
10. **Bubble diagram.**
11. **Act 4 sections** (4.4–4.8), one per review.
12. **Cluster and unit zoom.** *Blocked on Subhana's files, or use the redraw with her check.*
13. **"View all sheets"** at `/work/ephemeral-ground/sheets`.
14. **Mobile crops pass.**
15. **Performance, reduced motion, accessibility pass.** Add the sheets route to `site.pageNames` with a title.
16. **Optional: contours drawing in.** Trace the white lines from the p.10 crop and reveal them with a sweeping mask; fall back to 10–15 hand-traced lines, or skip.

---

## Files this will touch later (not now)

- New: `src/content/ephemeral-ground.ts`, shared camera helper, `src/components/ephemeral/*`, `sheets` route.
- Changed: `src/app/work/ephemeral-ground/page.tsx`, `EphemeralGroundPreview.tsx`, `site.ts`.
- Reused: `RevealImage`, `Grain`, `SiteHeader`, `TransitionLink`, `SpeechBubble` torn edge.

---

## Open questions (pending Subhana)

1. **Originals:** can she send the source files? This most affects Act 4's ending.
2. **Project name:** "Shared Territories" in the brief vs "Ephemeral Ground". Kept exactly for now.
3. **Bay of Bengal:** pp.10 and 15 say Bay of Bengal, but Campbell Bay faces the Andaman Sea. Kept for now.
4. **Tree figures:** 8.5 lakh in the text, 9 lakh on the graphic. Kept for now.
5. **Timber Veil:** the PSD shows a Gemini-generated lamp render. Is that the image on p.33, and should the site say so?
6. **Other people's material in the PSD:** nothing here ships it, but should she remove the CV and portfolio page?
7. **Sources:** the "to confirm" credits in section 6.
