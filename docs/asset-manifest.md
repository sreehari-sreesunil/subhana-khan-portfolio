# Asset manifest

For the swap to Subhana's high-quality originals. Measured 2026-11-01 on a production build at 1440×900 and 375×812.
133 image files, plus two SVGs that need no swap (`home/ephemeral-ground/map-osm.svg`, `thank-you.svg`). She approved the
current PDF and PSD images for now, and will send originals once the site is finished. The swap doesn't rewrite this file, so its sizes go stale after a batch of swaps.

## How to swap an image

1. Save her file as `assets-src/originals/<Image path>.<any extension>`, using the path in the tables below. For example,
   `assets-src/originals/ephemeral-ground/settlement/masterplan.png`. PNG, JPEG, TIFF and WebP all work.
2. Run the command below.
3. Check the page, then commit.

```bash
npm run images:swap
```

It converts the file to the site's format, shrinks it to 3840px wide at most, never enlarges it, and gives it the same
treatment as the image it replaces (such as turning white into paper). It then writes the real width and height into
the content files, so layouts follow the new file with no code changes, and clears the local resized-image cache, which would
otherwise keep showing the old picture. Re-running the full extraction keeps the originals.

`assets-src/` isn't committed, so keep her originals backed up elsewhere. Dropping a file directly into `public/images`
under the same name and format works too: run the same command to record its size.

## Rules for an original

- **Same framing** means the same crop and proportions as now, because labels sit on it by percentage. A different crop means
  redoing those positions, which live in `src/content/ephemeral-ground.ts`, not in layout code. Six thesis images need this, plus the home site plan.
- **Any other image** may change proportions: its sheet refits it.
- **Sharpness** is pixels divided by the widest size it's shown at. 2× is the target for sharp screens. Below 1× the browser is enlarging it.
- "No baked-in text" means labels were painted out and are real HTML on the page, so an original must be the clean version.
- Hidden PSD layers are not sources: they include another person's CV and portfolio page. Identifiable Jarawa and Shompen photos stay out.

## Upgrade first

Below 1.5× at their largest size, lowest first. Her file should reach the width in "Original should be".

| Image | Fig. | Current source | Pixels | Shown, 1440 | Shown, 375 | Sharpness | Original should be | An original must cover |
|---|---|---|---|---|---|---|---|---|
| `ephemeral-ground/ground/site-section` | – | PDF p.10, crop 80,825 – 1245,990 | 1165×165 | 1360×193 | 2523×357 | 0.5× | ≥5046px wide | No baked-in text; White or transparent background |
| `ephemeral-ground/ground/site-context` | – | PDF p.10, crop 1243,765 – 1712,1024 | 469×259 | 990×547 | 343×189 | 0.5× | ≥1980px wide | **Same framing** (the key-plan box are placed on it); No baked-in text; White or transparent background |
| `ephemeral-ground/ground/infra-4` | Fig. 3.5.4 â€” Shop | PDF p.10, crop 805,100 – 995,235 | 190×135 | 339×175 | 169×120 | 0.6× | ≥678px wide | White or transparent background |
| `ephemeral-ground/ground/infra-5` | Fig. 3.5.5 â€” Playing field | PDF p.10, crop 995,125 – 1215,235 | 220×110 | 339×121 | 169×84 | 0.6× | ≥678px wide | White or transparent background |
| `ephemeral-ground/ground/infra-3` | Fig. 3.5.3 â€” Gate and footpath | PDF p.10, crop 577,40 – 805,235 | 228×195 | 339×215 | 169×144 | 0.7× | ≥678px wide | White or transparent background |
| `ephemeral-ground/ground/infra-6` | Fig. 3.5.6 â€” Temple | PDF p.10, crop 1215,78 – 1445,235 | 230×157 | 339×173 | 169×115 | 0.7× | ≥678px wide | White or transparent background |
| `ephemeral-ground/island/proposal-map` | Fig. 1.4.2 â€” Development zones, as published | PDF p.7, crop 505,858 – 745,1215 | 240×357 | 212×315 | 343×510 | 0.7× | ≥686px wide | The whole image |
| `ephemeral-ground/ground/site-6` | Fig. 3.5.12 â€” Tidal creek | PDF p.10, crop 1422,1036 – 1660,1210 | 238×174 | 339×212 | 169×123 | 0.7× | ≥678px wide | The whole image |
| `ephemeral-ground/ground/site-2` | Fig. 3.5.8 â€” Rocky shore | PDF p.10, crop 278,1036 – 518,1210 | 240×174 | 339×184 | 169×122 | 0.7× | ≥678px wide | The whole image |
| `ephemeral-ground/ground/site-1` | Fig. 3.5.7 â€” Forest canopy | PDF p.10, crop 30,1036 – 278,1210 | 248×174 | 339×178 | 169×118 | 0.7× | ≥678px wide | The whole image |
| `ephemeral-ground/ground/infra-1` | Fig. 3.5.1 â€” Two-storey building | PDF p.10, crop 28,88 – 280,235 | 252×147 | 339×140 | 169×98 | 0.7× | ≥678px wide | White or transparent background |
| `ephemeral-ground/idea/slope-ratio` | – | PDF p.11, crop 845,436 – 1622,802 | 777×366 | 1020×480 | 343×162 | 0.8× | ≥2040px wide | No baked-in text; White or transparent background |
| `ephemeral-ground/island/dwelling-hut-a` | Fig. 1.3.2 â€” Thatched dome hut | PDF p.7, crop 512,582 – 883,786 | 371×204 | 457×251 | 231×127 | 0.8× | ≥914px wide | The whole image |
| `ephemeral-ground/ground/site-5` | Fig. 3.5.11 â€” Beach | PDF p.10, crop 1146,1036 – 1422,1210 | 276×174 | 339×180 | 169×106 | 0.8× | ≥678px wide | The whole image |
| `ephemeral-ground/island/dwelling-hut-b` | Fig. 1.3.3 â€” Hut on stilts | PDF p.7, crop 1527,582 – 1698,786 | 171×204 | 210×251 | 106×127 | 0.8× | ≥420px wide | The whole image |
| `ephemeral-ground/ground/site-4` | Fig. 3.5.10 â€” Mangroves | PDF p.10, crop 862,1036 – 1146,1210 | 284×174 | 339×175 | 169×103 | 0.8× | ≥678px wide | The whole image |
| `ephemeral-ground/ground/infra-2` | Fig. 3.5.2 â€” Lawn and path | PDF p.10, crop 280,78 – 577,235 | 297×157 | 339×125 | 169×89 | 0.9× | ≥678px wide | White or transparent background |
| `ephemeral-ground/settlement/opening-collage` | Fig. 4.1.1 â€” Collage | PDF p.13, crop 100,55 – 402,392 | 302×337 | 342×381 | 343×383 | 0.9× | ≥686px wide | White or transparent background |
| `ephemeral-ground/island/island-maps` | Fig. 1.6.2 â€” Andaman Islands in 1957, 1979 and 2004 | PDF p.8, crop 1395,85 – 1730,485 | 335×400 | 291×347 | 343×410 | 1.0× | ≥686px wide | The whole image |
| `ephemeral-ground/settlement/site-section` | Fig. 4.6.1 â€” Site section | PDF p.16, crop 0,945 – 1753,1185 | 1753×240 | 1384×189 | 1753×240 | 1.0× | ≥3506px wide | **Same framing** (section labels are placed on it); No baked-in text; White or transparent background |
| `ephemeral-ground/ground/contour-plan` | Fig. 3.4.1 â€” Site plan | PDF p.10, crop 65,290 – 1222,835 | 1157×545 | 1152×543 | 758×357 | 1.0× | ≥2304px wide | No baked-in text; White or transparent background |
| `ephemeral-ground/ground/site-3` | Fig. 3.5.9 â€” Road and forest | PDF p.10, crop 518,1036 – 862,1210 | 344×174 | 339×141 | 169×85 | 1.0× | ≥678px wide | The whole image |
| `ephemeral-ground/island/malacca-map` | Fig. 1.2.2 â€” Strait of Malacca | PDF p.7, crop 1260,130 – 1725,500 | 465×370 | 456×363 | 343×273 | 1.0× | ≥912px wide | The whole image |
| `ephemeral-ground/island/port-map` | Fig. 1.5.3 â€” Proposed port, Galathea Bay | PDF p.8, crop 545,845 – 915,1140 | 370×295 | 342×272 | 343×273 | 1.1× | ≥686px wide | The whole image |
| `ephemeral-ground/settlement/strategy-contour` | Fig. 4.5.7 â€” Contour Responsive Planning | PDF p.16, crop 930,515 – 1265,675 | 335×160 | 292×139 | 302×144 | 1.1× | ≥604px wide | White or transparent background |
| `ephemeral-ground/idea/walker` | – | PSD layer 1746, crop 495,570 – 1075,715 | 580×145 | 518×130 | 123×31 | 1.1× | ≥1036px wide | The whole image |
| `ephemeral-ground/island/section-sketch` | Fig. 1.5.4 â€” Section through forest, wetland and shore | PDF p.8, crop 975,845 – 1368,1160 | 393×315 | 342×274 | 343×275 | 1.1× | ≥686px wide | The whole image |
| `ephemeral-ground/settlement/strategy-ecology` | Fig. 4.5.3 â€” Ecological Preservation | PDF p.16, crop 910,110 – 1295,275 | 385×165 | 331×147 | 336×144 | 1.1× | ≥672px wide | White or transparent background |
| `ephemeral-ground/settlement/strategy-resilience` | Fig. 4.5.6 â€” Disaster Resilience | PDF p.16, crop 485,550 – 885,662 | 400×112 | 331×112 | 343×112 | 1.2× | ≥686px wide | White or transparent background |
| `ephemeral-ground/idea/strategy-exchange` | – | PDF p.12, crop 1330,405 – 1670,605 | 340×200 | 246×145 | 289×170 | 1.2× | ≥578px wide | The whole image |
| `ephemeral-ground/idea/strategy-market` | – | PDF p.12, crop 858,728 – 1118,968 | 260×240 | 221×204 | 221×204 | 1.2× | ≥442px wide | The whole image |
| `ephemeral-ground/idea/strategy-steps` | – | PDF p.12, crop 860,210 – 1200,460 | 340×250 | 246×181 | 289×213 | 1.2× | ≥578px wide | The whole image |
| `ephemeral-ground/idea/strategy-canopy` | – | PDF p.12, crop 525,95 – 838,195 | 313×100 | 246×79 | 266×85 | 1.2× | ≥532px wide | The whole image |
| `ephemeral-ground/idea/strategy-buffer` | – | PDF p.12, crop 535,455 – 780,590 | 245×135 | 208×115 | 208×115 | 1.2× | ≥416px wide | The whole image |
| `ephemeral-ground/idea/strategy-terrain` | – | PDF p.12, crop 535,680 – 760,845 | 225×165 | 191×140 | 191×140 | 1.2× | ≥382px wide | The whole image |
| `ephemeral-ground/idea/strategy-climate` | – | PDF p.12, crop 575,1005 – 780,1205 | 205×200 | 174×170 | 174×170 | 1.2× | ≥348px wide | The whole image |
| `ephemeral-ground/idea/strategy-water` | – | PDF p.12, crop 1470,750 – 1708,1020 | 238×270 | 202×229 | 202×229 | 1.2× | ≥404px wide | The whole image |
| `ephemeral-ground/idea/strategy-boat` | – | PDF p.12, crop 900,980 – 1065,1205 | 165×225 | 140×191 | 140×191 | 1.2× | ≥280px wide | The whole image |
| `ephemeral-ground/idea/strategy-locator` | – | PDF p.12, crop 1530,55 – 1635,255 | 105×200 | 89×170 | 89×170 | 1.2× | ≥178px wide | The whole image |
| `ephemeral-ground/ground/tribal-map` | Fig. 3.1.1 â€” Tribal areas and national parks | PDF p.9, crop 85,40 – 565,700 | 480×660 | 400×549 | 343×472 | 1.2× | ≥800px wide | No baked-in text |
| `ephemeral-ground/ground/land-use-map` | Fig. 3.1.3 â€” Proposed land use | PDF p.9, crop 1260,40 – 1735,700 | 475×660 | 395×549 | 343×477 | 1.2× | ≥790px wide | The whole image |
| `ephemeral-ground/ground/project-land-map` | Fig. 3.1.2 â€” Land Details Within the Project Area | PDF p.9, crop 680,40 – 1140,705 | 460×665 | 380×549 | 343×496 | 1.2× | ≥760px wide | The whole image |
| `ephemeral-ground/settlement/strategy-walkability` | Fig. 4.5.5 â€” Walkability | PDF p.16, crop 65,515 – 395,695 | 330×180 | 256×139 | 264×144 | 1.2× | ≥528px wide | White or transparent background |
| `ephemeral-ground/ground/settlements-strip` | Fig. 3.2.1 â€” The settlements | PDF p.9, crop 0,735 – 1753,1215 | 1753×480 | 1384×379 | 1305×357 | 1.3× | ≥2768px wide | **Same framing** (settlement names are placed on it); No baked-in text; White or transparent background |
| `ephemeral-ground/idea/strategy-wetland` | – | PDF p.12, crop 100,855 – 495,1010 | 395×155 | 246×97 | 311×122 | 1.3× | ≥622px wide | The whole image |
| `ephemeral-ground/idea/render-housing` | – | PSD layer 1788 | 1340×740 | 1037×572 | 343×189 | 1.3× | ≥2074px wide | The whole image |
| `ephemeral-ground/settlement/strategy-roads` | Fig. 4.5.8 â€” Road Network | PDF p.16, crop 1420,515 – 1635,705 | 215×190 | 158×139 | 163×144 | 1.3× | ≥326px wide | No baked-in text; White or transparent background |
| `home/about/portrait-temp` | – | PDF p.01, cut out of the flattened page | 376×621 | 283×468 | 169×279 | 1.3× | ≥566px wide | A portrait of her, on a transparent or plain background |
| `ephemeral-ground/idea/lone-tree` | – | PSD layer 1743, crop 820,195 – 1090,556 | 270×361 | 202×270 | 132×176 | 1.3× | ≥404px wide | The whole image |
| `ephemeral-ground/settlement/strategy-water` | Fig. 4.5.1 â€” Water Strategy | PDF p.16, crop 70,105 – 400,305 | 330×200 | 243×147 | 238×144 | 1.4× | ≥486px wide | White or transparent background |
| `ephemeral-ground/idea/arch-pallasmaa` | – | PSD layer 1629, crop 530,0 – 1000,1190 | 470×1190 | 234×591 | 343×868 | 1.4× | ≥686px wide | The whole image |
| `ephemeral-ground/island/heat-map` | Fig. 1.5.2 â€” Land surface temperature | PDF p.8, crop 268,845 – 498,1140 | 230×295 | 166×213 | 167×214 | 1.4× | ≥334px wide | The whole image |
| `ephemeral-ground/island/trees-graphic` | Fig. 1.5.1 â€” Great Nicobar coast | PDF p.8, crop 30,845 – 265,1140 | 235×295 | 170×213 | 170×214 | 1.4× | ≥340px wide | The whole image |
| `ephemeral-ground/idea/arch-tanizaki` | – | PSD layer 1629, crop 1002,0 – 1478,1000 | 476×1000 | 237×497 | 343×721 | 1.4× | ≥686px wide | The whole image |
| `ephemeral-ground/idea/strategy-tower` | – | PDF p.12, crop 70,220 – 510,430 | 440×210 | 246×118 | 311×148 | 1.4× | ≥622px wide | The whole image |
| `ephemeral-ground/settlement/tsunami-zoning` | Fig. 4.4.1 â€” Zoning plan | PDF p.14, crop 44,505 – 1375,1212 | 1331×707 | 921×489 | 343×182 | 1.4× | ≥1842px wide | White or transparent background |
| `ephemeral-ground/settlement/masterplan` | Fig. 4.2.1 â€” Masterplan | PDF p.15, crop 35,300 – 1700,1125 | 1665×825 | 1150×570 | 341×169 | 1.4× | ≥2300px wide | **Same framing** (her numbers and its map position are placed on it); Transparent outside the plan |
| `ephemeral-ground/idea/render-hall` | – | PSD smart object, layer 1783 | 500×598 | 317×379 | 343×410 | 1.5× | ≥686px wide | The whole image |
| `ephemeral-ground/idea/render-residential` | – | PSD smart object, layer 1787 | 500×598 | 317×379 | 343×410 | 1.5× | ≥686px wide | The whole image |

Also upgrade, though the numbers above don't show it:

- Site photos 3.5 (`ephemeral-ground/ground/site-*`): they open in the full-screen viewer, which stops at 3× their real size, and they're only 174–195px tall.
- Zoning plan (`ephemeral-ground/settlement/tsunami-zoning`): its baked-in labels have spelling questions, so it needs a clean version whatever its size.

## Every image

### Home, About and preloader

| Image | Fig. | Current source | Pixels | Shown, 1440 | Shown, 375 | Sharpness | Original should be | An original must cover |
|---|---|---|---|---|---|---|---|---|
| `home/about/portrait-temp` | – | PDF p.01, cut out of the flattened page | 376×621 | 283×468 | 169×279 | 1.3× | ≥566px wide | A portrait of her, on a transparent or plain background |
| `home/ephemeral-ground/site-plan` | – | `ug thesis.psd` Layer 93 (2800px web version) | 2800×780 | 943×263 | 446×124 | 3.0× | Fine as is | **Same framing** (it lands on the map at a fixed position) |
| `home/figures/children` | – | `cover.psd`, cutout | 235×315 | 86×115 | 39×52 | 2.7× | Fine as is | Transparent background |
| `home/figures/elderly-couple` | – | `cover.psd`, cutout | 140×213 | 51×78 | 23×35 | 2.7× | Fine as is | Transparent background |
| `home/figures/leaning-woman` | – | `cover.psd`, cutout | 171×391 | 63×143 | 28×65 | 2.7× | Fine as is | Transparent background |
| `home/figures/walking-woman` | – | `cover.psd`, cutout | 248×421 | 91×154 | 41×70 | 2.7× | Fine as is | Transparent background |
| `home/figures/yellow-dress-woman` | – | `cover.psd`, cutout | 123×324 | 45×119 | 20×54 | 2.7× | Fine as is | Transparent background |
| `home/preloader/2021` | – | PDF page crop, listed in `src/content/home.ts` | 438×600 | – | – | – | – | Any framing |
| `home/preloader/2022` | – | PDF page crop, listed in `src/content/home.ts` | 600×319 | – | – | – | – | Any framing |
| `home/preloader/2023` | – | PDF page crop, listed in `src/content/home.ts` | 600×373 | – | – | – | – | Any framing |
| `home/preloader/2024` | – | PDF page crop, listed in `src/content/home.ts` | 600×349 | – | – | – | – | Any framing |
| `home/preloader/2025` | – | PDF page crop, listed in `src/content/home.ts` | 401×600 | – | – | – | – | Any framing |
| `home/preloader/2026` | – | PDF page crop, listed in `src/content/home.ts` | 600×225 | – | – | – | – | Any framing |
| `home/tiles/tile-01` | – | `cover.psd`, hero collage cell | 421×993 | 172×360 | 72×162 | 2.4× | Fine as is | Fills its cell; edges may be cropped |
| `home/tiles/tile-02` | – | `cover.psd`, hero collage cell | 420×436 | 172×160 | 72×72 | 2.4× | Fine as is | Fills its cell; edges may be cropped |
| `home/tiles/tile-03` | – | `cover.psd`, hero collage cell | 423×436 | 172×160 | 72×72 | 2.5× | Fine as is | Fills its cell; edges may be cropped |
| `home/tiles/tile-04` | – | `cover.psd`, hero collage cell | 424×436 | 172×160 | 72×72 | 2.5× | Fine as is | Fills its cell; edges may be cropped |
| `home/tiles/tile-05` | – | `cover.psd`, hero collage cell | 420×437 | 172×160 | 72×72 | 2.4× | Fine as is | Fills its cell; edges may be cropped |
| `home/tiles/tile-06` | – | `cover.psd`, hero collage cell | 948×437 | 387×160 | 162×72 | 2.4× | Fine as is | Fills its cell; edges may be cropped |
| `home/tiles/tile-07` | – | `cover.psd`, hero collage cell | 421×438 | 172×160 | 72×72 | 2.4× | Fine as is | Fills its cell; edges may be cropped |
| `home/tiles/tile-08` | – | `cover.psd`, hero collage cell | 420×438 | 172×160 | 72×72 | 2.4× | Fine as is | Fills its cell; edges may be cropped |
| `home/tiles/tile-09` | – | `cover.psd`, hero collage cell | 423×438 | 172×160 | 72×72 | 2.5× | Fine as is | Fills its cell; edges may be cropped |
| `home/tiles/tile-10` | – | `cover.psd`, hero collage cell | 424×438 | 172×160 | 72×72 | 2.5× | Fine as is | Fills its cell; edges may be cropped |
| `home/tiles/tile-11` | – | `cover.psd`, hero collage cell | 962×436 | 387×160 | 162×72 | 2.5× | Fine as is | Fills its cell; edges may be cropped |
| `home/tiles/tile-12` | – | `cover.psd`, hero collage cell | 423×436 | 172×160 | 72×72 | 2.5× | Fine as is | Fills its cell; edges may be cropped |
| `home/tiles/tile-13` | – | `cover.psd`, hero collage cell | 424×436 | 172×160 | 72×72 | 2.5× | Fine as is | Fills its cell; edges may be cropped |

### Thesis: opening

| Image | Fig. | Current source | Pixels | Shown, 1440 | Shown, 375 | Sharpness | Original should be | An original must cover |
|---|---|---|---|---|---|---|---|---|
| `ephemeral-ground/opening/plan-mobile` | – | PSD full-res site plan, phone crop 52–79% across, 19–78% down | 1400×853 | – | – | – | – | The whole image |

### Thesis: Act 1, the island

| Image | Fig. | Current source | Pixels | Shown, 1440 | Shown, 375 | Sharpness | Original should be | An original must cover |
|---|---|---|---|---|---|---|---|---|
| `ephemeral-ground/island/dwelling-hut-a` | Fig. 1.3.2 â€” Thatched dome hut | PDF p.7, crop 512,582 – 883,786 | 371×204 | 457×251 | 231×127 | 0.8× | ≥914px wide | The whole image |
| `ephemeral-ground/island/dwelling-hut-b` | Fig. 1.3.3 â€” Hut on stilts | PDF p.7, crop 1527,582 – 1698,786 | 171×204 | 210×251 | 106×127 | 0.8× | ≥420px wide | The whole image |
| `ephemeral-ground/island/heat-map` | Fig. 1.5.2 â€” Land surface temperature | PDF p.8, crop 268,845 – 498,1140 | 230×295 | 166×213 | 167×214 | 1.4× | ≥334px wide | The whole image |
| `ephemeral-ground/island/icon-airport` | – | PDF p.7, crop 1052,915 – 1172,1032 | 120×117 | 62×60 | 58×57 | 1.9× | ≥124px wide | The whole image |
| `ephemeral-ground/island/icon-power` | – | PDF p.7, crop 1600,915 – 1672,1030 | 72×115 | 38×60 | 36×57 | 1.9× | ≥76px wide | The whole image |
| `ephemeral-ground/island/icon-terminal` | – | PDF p.7, crop 1418,912 – 1542,1032 | 124×120 | 62×60 | 59×57 | 2.0× | Fine as is | The whole image |
| `ephemeral-ground/island/icon-township` | – | PDF p.7, crop 1238,915 – 1370,1032 | 132×117 | 68×60 | 64×57 | 1.9× | ≥136px wide | The whole image |
| `ephemeral-ground/island/island-maps` | Fig. 1.6.2 â€” Andaman Islands in 1957, 1979 and 2004 | PDF p.8, crop 1395,85 – 1730,485 | 335×400 | 291×347 | 343×410 | 1.0× | ≥686px wide | The whole image |
| `ephemeral-ground/island/malacca-map` | Fig. 1.2.2 â€” Strait of Malacca | PDF p.7, crop 1260,130 – 1725,500 | 465×370 | 456×363 | 343×273 | 1.0× | ≥912px wide | The whole image |
| `ephemeral-ground/island/port-map` | Fig. 1.5.3 â€” Proposed port, Galathea Bay | PDF p.8, crop 545,845 – 915,1140 | 370×295 | 342×272 | 343×273 | 1.1× | ≥686px wide | The whole image |
| `ephemeral-ground/island/proposal-map` | Fig. 1.4.2 â€” Development zones, as published | PDF p.7, crop 505,858 – 745,1215 | 240×357 | 212×315 | 343×510 | 0.7× | ≥686px wide | The whole image |
| `ephemeral-ground/island/section-sketch` | Fig. 1.5.4 â€” Section through forest, wetland and shore | PDF p.8, crop 975,845 – 1368,1160 | 393×315 | 342×274 | 343×275 | 1.1× | ≥686px wide | The whole image |
| `ephemeral-ground/island/trees-graphic` | Fig. 1.5.1 â€” Great Nicobar coast | PDF p.8, crop 30,845 – 265,1140 | 235×295 | 170×213 | 170×214 | 1.4× | ≥340px wide | The whole image |

### Thesis: Act 2, the idea

| Image | Fig. | Current source | Pixels | Shown, 1440 | Shown, 375 | Sharpness | Original should be | An original must cover |
|---|---|---|---|---|---|---|---|---|
| `ephemeral-ground/idea/accessibility` | – | PDF p.11, crop 845,804 – 1622,1190 | 777×386 | 342×170 | 343×170 | 2.3× | Fine as is | White or transparent background |
| `ephemeral-ground/idea/arch-collage` | Fig. 2.6.2 â€” A different logic | PDF p.11, crop 90,90 – 695,990 | 605×900 | 342×508 | 343×510 | 1.8× | ≥686px wide | White or transparent background |
| `ephemeral-ground/idea/arch-pallasmaa` | – | PSD layer 1629, crop 530,0 – 1000,1190 | 470×1190 | 234×591 | 343×868 | 1.4× | ≥686px wide | The whole image |
| `ephemeral-ground/idea/arch-rosa` | – | PSD layer 1629, crop 0,0 – 520,1190 | 520×1190 | 258×591 | 343×785 | 1.5× | ≥686px wide | The whole image |
| `ephemeral-ground/idea/arch-tanizaki` | – | PSD layer 1629, crop 1002,0 – 1478,1000 | 476×1000 | 237×497 | 343×721 | 1.4× | ≥686px wide | The whole image |
| `ephemeral-ground/idea/arch-zumthor` | – | PSD layer 1629, crop 1430,0 – 1957,1265 | 527×1265 | 262×629 | 343×823 | 1.5× | ≥686px wide | The whole image |
| `ephemeral-ground/idea/case-brick` | – | PSD layer 1761, crop 340,0 – 1549,530 | 1209×530 | 791×347 | 644×283 | 1.5× | ≥1582px wide | **Same framing** (her captions are placed on it) |
| `ephemeral-ground/idea/case-brion` | – | PSD layer 1757 | 2152×683 | 1408×447 | 1147×364 | 1.5× | ≥2816px wide | **Same framing** (her captions are placed on it) |
| `ephemeral-ground/idea/lone-tree` | – | PSD layer 1743, crop 820,195 – 1090,556 | 270×361 | 202×270 | 132×176 | 1.3× | ≥404px wide | The whole image |
| `ephemeral-ground/idea/neuro-architecture` | – | PSD layer 1709 | 462×470 | 240×244 | 240×244 | 1.9× | ≥480px wide | The whole image |
| `ephemeral-ground/idea/neuro-environment` | – | PSD layer 1719 | 468×477 | 240×245 | 240×245 | 1.9× | ≥480px wide | The whole image |
| `ephemeral-ground/idea/neuro-legibility` | – | PSD layer 1714 | 432×620 | 240×344 | 240×344 | 1.8× | ≥480px wide | The whole image |
| `ephemeral-ground/idea/neuro-nature` | – | PSD layer 1703, crop 230,0 – 689,528 | 459×528 | 240×276 | 240×276 | 1.9× | ≥480px wide | The whole image |
| `ephemeral-ground/idea/neuro-sensory` | – | PSD layer 1694 | 449×492 | 240×263 | 240×263 | 1.9× | ≥480px wide | The whole image |
| `ephemeral-ground/idea/neuro-stress` | – | PSD layer 1689 | 461×532 | 240×277 | 240×277 | 1.9× | ≥480px wide | The whole image |
| `ephemeral-ground/idea/photo-strip` | – | PSD layer 1681 | 2112×460 | – | – | – | – | The whole image |
| `ephemeral-ground/idea/render-hall` | – | PSD smart object, layer 1783 | 500×598 | 317×379 | 343×410 | 1.5× | ≥686px wide | The whole image |
| `ephemeral-ground/idea/render-housing` | – | PSD layer 1788 | 1340×740 | 1037×572 | 343×189 | 1.3× | ≥2074px wide | The whole image |
| `ephemeral-ground/idea/render-library` | – | PSD layers 1784 + 1785, stacked | 1072×1196 | 689×769 | 343×383 | 1.6× | ≥1378px wide | The whole image |
| `ephemeral-ground/idea/render-residential` | – | PSD smart object, layer 1787 | 500×598 | 317×379 | 343×410 | 1.5× | ≥686px wide | The whole image |
| `ephemeral-ground/idea/slope-ratio` | – | PDF p.11, crop 845,436 – 1622,802 | 777×366 | 1020×480 | 343×162 | 0.8× | ≥2040px wide | No baked-in text; White or transparent background |
| `ephemeral-ground/idea/strategy-boat` | – | PDF p.12, crop 900,980 – 1065,1205 | 165×225 | 140×191 | 140×191 | 1.2× | ≥280px wide | The whole image |
| `ephemeral-ground/idea/strategy-buffer` | – | PDF p.12, crop 535,455 – 780,590 | 245×135 | 208×115 | 208×115 | 1.2× | ≥416px wide | The whole image |
| `ephemeral-ground/idea/strategy-canopy` | – | PDF p.12, crop 525,95 – 838,195 | 313×100 | 246×79 | 266×85 | 1.2× | ≥532px wide | The whole image |
| `ephemeral-ground/idea/strategy-climate` | – | PDF p.12, crop 575,1005 – 780,1205 | 205×200 | 174×170 | 174×170 | 1.2× | ≥348px wide | The whole image |
| `ephemeral-ground/idea/strategy-exchange` | – | PDF p.12, crop 1330,405 – 1670,605 | 340×200 | 246×145 | 289×170 | 1.2× | ≥578px wide | The whole image |
| `ephemeral-ground/idea/strategy-locator` | – | PDF p.12, crop 1530,55 – 1635,255 | 105×200 | 89×170 | 89×170 | 1.2× | ≥178px wide | The whole image |
| `ephemeral-ground/idea/strategy-market` | – | PDF p.12, crop 858,728 – 1118,968 | 260×240 | 221×204 | 221×204 | 1.2× | ≥442px wide | The whole image |
| `ephemeral-ground/idea/strategy-steps` | – | PDF p.12, crop 860,210 – 1200,460 | 340×250 | 246×181 | 289×213 | 1.2× | ≥578px wide | The whole image |
| `ephemeral-ground/idea/strategy-terrain` | – | PDF p.12, crop 535,680 – 760,845 | 225×165 | 191×140 | 191×140 | 1.2× | ≥382px wide | The whole image |
| `ephemeral-ground/idea/strategy-tower` | – | PDF p.12, crop 70,220 – 510,430 | 440×210 | 246×118 | 311×148 | 1.4× | ≥622px wide | The whole image |
| `ephemeral-ground/idea/strategy-water` | – | PDF p.12, crop 1470,750 – 1708,1020 | 238×270 | 202×229 | 202×229 | 1.2× | ≥404px wide | The whole image |
| `ephemeral-ground/idea/strategy-wetland` | – | PDF p.12, crop 100,855 – 495,1010 | 395×155 | 246×97 | 311×122 | 1.3× | ≥622px wide | The whole image |
| `ephemeral-ground/idea/terrain` | – | PDF p.11, crop 845,112 – 1622,390 | 777×278 | 342×122 | 343×123 | 2.3× | Fine as is | White or transparent background |
| `ephemeral-ground/idea/walker` | – | PSD layer 1746, crop 495,570 – 1075,715 | 580×145 | 518×130 | 123×31 | 1.1× | ≥1036px wide | The whole image |

### Thesis: Act 3, the ground

| Image | Fig. | Current source | Pixels | Shown, 1440 | Shown, 375 | Sharpness | Original should be | An original must cover |
|---|---|---|---|---|---|---|---|---|
| `ephemeral-ground/ground/contour-plan` | Fig. 3.4.1 â€” Site plan | PDF p.10, crop 65,290 – 1222,835 | 1157×545 | 1152×543 | 758×357 | 1.0× | ≥2304px wide | No baked-in text; White or transparent background |
| `ephemeral-ground/ground/infra-1` | Fig. 3.5.1 â€” Two-storey building | PDF p.10, crop 28,88 – 280,235 | 252×147 | 339×140 | 169×98 | 0.7× | ≥678px wide | White or transparent background |
| `ephemeral-ground/ground/infra-2` | Fig. 3.5.2 â€” Lawn and path | PDF p.10, crop 280,78 – 577,235 | 297×157 | 339×125 | 169×89 | 0.9× | ≥678px wide | White or transparent background |
| `ephemeral-ground/ground/infra-3` | Fig. 3.5.3 â€” Gate and footpath | PDF p.10, crop 577,40 – 805,235 | 228×195 | 339×215 | 169×144 | 0.7× | ≥678px wide | White or transparent background |
| `ephemeral-ground/ground/infra-4` | Fig. 3.5.4 â€” Shop | PDF p.10, crop 805,100 – 995,235 | 190×135 | 339×175 | 169×120 | 0.6× | ≥678px wide | White or transparent background |
| `ephemeral-ground/ground/infra-5` | Fig. 3.5.5 â€” Playing field | PDF p.10, crop 995,125 – 1215,235 | 220×110 | 339×121 | 169×84 | 0.6× | ≥678px wide | White or transparent background |
| `ephemeral-ground/ground/infra-6` | Fig. 3.5.6 â€” Temple | PDF p.10, crop 1215,78 – 1445,235 | 230×157 | 339×173 | 169×115 | 0.7× | ≥678px wide | White or transparent background |
| `ephemeral-ground/ground/land-use-map` | Fig. 3.1.3 â€” Proposed land use | PDF p.9, crop 1260,40 – 1735,700 | 475×660 | 395×549 | 343×477 | 1.2× | ≥790px wide | The whole image |
| `ephemeral-ground/ground/project-land-map` | Fig. 3.1.2 â€” Land Details Within the Project Area | PDF p.9, crop 680,40 – 1140,705 | 460×665 | 380×549 | 343×496 | 1.2× | ≥760px wide | The whole image |
| `ephemeral-ground/ground/settlements-strip` | Fig. 3.2.1 â€” The settlements | PDF p.9, crop 0,735 – 1753,1215 | 1753×480 | 1384×379 | 1305×357 | 1.3× | ≥2768px wide | **Same framing** (settlement names are placed on it); No baked-in text; White or transparent background |
| `ephemeral-ground/ground/site-1` | Fig. 3.5.7 â€” Forest canopy | PDF p.10, crop 30,1036 – 278,1210 | 248×174 | 339×178 | 169×118 | 0.7× | ≥678px wide | The whole image |
| `ephemeral-ground/ground/site-2` | Fig. 3.5.8 â€” Rocky shore | PDF p.10, crop 278,1036 – 518,1210 | 240×174 | 339×184 | 169×122 | 0.7× | ≥678px wide | The whole image |
| `ephemeral-ground/ground/site-3` | Fig. 3.5.9 â€” Road and forest | PDF p.10, crop 518,1036 – 862,1210 | 344×174 | 339×141 | 169×85 | 1.0× | ≥678px wide | The whole image |
| `ephemeral-ground/ground/site-4` | Fig. 3.5.10 â€” Mangroves | PDF p.10, crop 862,1036 – 1146,1210 | 284×174 | 339×175 | 169×103 | 0.8× | ≥678px wide | The whole image |
| `ephemeral-ground/ground/site-5` | Fig. 3.5.11 â€” Beach | PDF p.10, crop 1146,1036 – 1422,1210 | 276×174 | 339×180 | 169×106 | 0.8× | ≥678px wide | The whole image |
| `ephemeral-ground/ground/site-6` | Fig. 3.5.12 â€” Tidal creek | PDF p.10, crop 1422,1036 – 1660,1210 | 238×174 | 339×212 | 169×123 | 0.7× | ≥678px wide | The whole image |
| `ephemeral-ground/ground/site-context` | – | PDF p.10, crop 1243,765 – 1712,1024 | 469×259 | 990×547 | 343×189 | 0.5× | ≥1980px wide | **Same framing** (the key-plan box are placed on it); No baked-in text; White or transparent background |
| `ephemeral-ground/ground/site-section` | – | PDF p.10, crop 80,825 – 1245,990 | 1165×165 | 1360×193 | 2523×357 | 0.5× | ≥5046px wide | No baked-in text; White or transparent background |
| `ephemeral-ground/ground/tribal-map` | Fig. 3.1.1 â€” Tribal areas and national parks | PDF p.9, crop 85,40 – 565,700 | 480×660 | 400×549 | 343×472 | 1.2× | ≥800px wide | No baked-in text |

### Thesis: Act 4, the settlement

| Image | Fig. | Current source | Pixels | Shown, 1440 | Shown, 375 | Sharpness | Original should be | An original must cover |
|---|---|---|---|---|---|---|---|---|
| `ephemeral-ground/settlement/apartment-plan` | – | PDF p.19, crop 1285,815 – 1680,952 | 395×137 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/apartment-section` | – | PDF p.19, crop 1220,1018 – 1730,1158 | 510×140 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/cluster-diagram` | – | PDF p.13, crop 530,405 – 788,690 | 258×285 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/cluster-residential` | – | PDF p.20, crop 258,120 – 900,812 | 642×692 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/cluster-tourist` | – | PDF p.20, crop 1060,85 – 1445,812 | 385×727 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/commons-plan` | – | PDF p.19, crop 1075,272 – 1217,445 | 142×173 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/cultural-key` | – | PDF p.22, crop 1222,85 – 1710,385 | 488×300 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/cultural-plan` | – | PDF p.22, crop 80,90 – 1400,1005 | 1320×915 | – | – | – | – | No baked-in text |
| `ephemeral-ground/settlement/cultural-section` | – | PDF p.22, crop 0,1025 – 940,1235 | 940×210 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/family-first` | – | PDF p.19, crop 1390,520 – 1715,672 | 325×152 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/family-ground` | – | PDF p.19, crop 1065,520 – 1392,672 | 327×152 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/forest-aerial` | – | PDF p.13, crop 0,527 – 540,705 | 540×178 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/hall-models` | – | PDF p.17, crop 75,770 – 635,1172 | 560×402 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/hall-plans` | – | PDF p.17, crop 520,55 – 1700,1178 | 1180×1123 | – | – | – | – | No baked-in text |
| `ephemeral-ground/settlement/hut-photos` | – | PDF p.19, crop 925,60 – 1108,185 | 183×125 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/isometric-model` | – | PDF p.13, crop 1005,305 – 1710,735 | 705×430 | – | – | – | – | No baked-in text |
| `ephemeral-ground/settlement/kitchen-elevation` | – | PDF p.18, crop 45,980 – 1660,1235 | 1615×255 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/kitchen-key` | – | PDF p.18, crop 1215,85 – 1710,320 | 495×235 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/kitchen-plans` | – | PDF p.18, crop 110,95 – 1090,905 | 980×810 | – | – | – | – | No baked-in text |
| `ephemeral-ground/settlement/masterplan` | Fig. 4.2.1 â€” Masterplan | PDF p.15, crop 35,300 – 1700,1125 | 1665×825 | 1150×570 | 341×169 | 1.4× | ≥2300px wide | **Same framing** (her numbers and its map position are placed on it); Transparent outside the plan |
| `ephemeral-ground/settlement/materials` | – | PDF p.21, crop 1437,815 – 1682,890 | 245×75 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/opening-collage` | Fig. 4.1.1 â€” Collage | PDF p.13, crop 100,55 – 402,392 | 302×337 | 342×381 | 343×383 | 0.9× | ≥686px wide | White or transparent background |
| `ephemeral-ground/settlement/residential-plan` | – | PDF p.19, crop 45,85 – 865,1195 | 820×1110 | – | – | – | – | No baked-in text |
| `ephemeral-ground/settlement/site-section` | Fig. 4.6.1 â€” Site section | PDF p.16, crop 0,945 – 1753,1185 | 1753×240 | 1384×189 | 1753×240 | 1.0× | ≥3506px wide | **Same framing** (section labels are placed on it); No baked-in text; White or transparent background |
| `ephemeral-ground/settlement/small-unit` | – | PDF p.19, crop 1020,768 – 1180,892 | 160×124 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/strategy-contour` | Fig. 4.5.7 â€” Contour Responsive Planning | PDF p.16, crop 930,515 – 1265,675 | 335×160 | 292×139 | 302×144 | 1.1× | ≥604px wide | White or transparent background |
| `ephemeral-ground/settlement/strategy-ecology` | Fig. 4.5.3 â€” Ecological Preservation | PDF p.16, crop 910,110 – 1295,275 | 385×165 | 331×147 | 336×144 | 1.1× | ≥672px wide | White or transparent background |
| `ephemeral-ground/settlement/strategy-gradient` | Fig. 4.5.2 â€” Publicâ€“Private Gradient | PDF p.16, crop 570,25 – 735,325 | 165×300 | 81×147 | 79×144 | 2.0× | Fine as is | White or transparent background |
| `ephemeral-ground/settlement/strategy-layout` | Fig. 4.5.4 â€” Scattered Building Layout | PDF p.16, crop 1395,65 – 1660,320 | 265×255 | 153×147 | 150×144 | 1.7× | ≥306px wide | White or transparent background |
| `ephemeral-ground/settlement/strategy-resilience` | Fig. 4.5.6 â€” Disaster Resilience | PDF p.16, crop 485,550 – 885,662 | 400×112 | 331×112 | 343×112 | 1.2× | ≥686px wide | White or transparent background |
| `ephemeral-ground/settlement/strategy-roads` | Fig. 4.5.8 â€” Road Network | PDF p.16, crop 1420,515 – 1635,705 | 215×190 | 158×139 | 163×144 | 1.3× | ≥326px wide | No baked-in text; White or transparent background |
| `ephemeral-ground/settlement/strategy-walkability` | Fig. 4.5.5 â€” Walkability | PDF p.16, crop 65,515 – 395,695 | 330×180 | 256×139 | 264×144 | 1.2× | ≥528px wide | White or transparent background |
| `ephemeral-ground/settlement/strategy-water` | Fig. 4.5.1 â€” Water Strategy | PDF p.16, crop 70,105 – 400,305 | 330×200 | 243×147 | 238×144 | 1.4× | ≥486px wide | White or transparent background |
| `ephemeral-ground/settlement/street-elevation` | – | PDF p.20, crop 235,875 – 1695,1160 | 1460×285 | – | – | – | – | The whole image |
| `ephemeral-ground/settlement/tsunami-render` | Fig. 4.4.2 â€” Landmark tower | PDF p.14, crop 52,90 – 1090,465 | 1038×375 | 457×165 | 343×124 | 2.3× | Fine as is | White or transparent background |
| `ephemeral-ground/settlement/tsunami-zoning` | Fig. 4.4.1 â€” Zoning plan | PDF p.14, crop 44,505 – 1375,1212 | 1331×707 | 921×489 | 343×182 | 1.4× | ≥1842px wide | White or transparent background |
| `ephemeral-ground/settlement/visitors-plan` | – | PDF p.21, crop 135,55 – 1550,845 | 1415×790 | – | – | – | – | No baked-in text |
| `ephemeral-ground/settlement/visitors-section` | – | PDF p.21, crop 200,875 – 1430,1240 | 1230×365 | – | – | – | – | No baked-in text |
| `ephemeral-ground/settlement/walkway-sketch` | – | PDF p.20, crop 45,680 – 245,790 | 200×110 | – | – | – | – | The whole image |

## Not measured

Not measured because they aren't on a page yet (Act 4 sections still to come), or show only briefly (the preloader) or at one screen size.

`ephemeral-ground/idea/photo-strip`, `ephemeral-ground/opening/plan-mobile`, `ephemeral-ground/settlement/apartment-plan`, `ephemeral-ground/settlement/apartment-section`, `ephemeral-ground/settlement/cluster-diagram`, `ephemeral-ground/settlement/cluster-residential`, `ephemeral-ground/settlement/cluster-tourist`, `ephemeral-ground/settlement/commons-plan`, `ephemeral-ground/settlement/cultural-key`, `ephemeral-ground/settlement/cultural-plan`, `ephemeral-ground/settlement/cultural-section`, `ephemeral-ground/settlement/family-first`, `ephemeral-ground/settlement/family-ground`, `ephemeral-ground/settlement/forest-aerial`, `ephemeral-ground/settlement/hall-models`, `ephemeral-ground/settlement/hall-plans`, `ephemeral-ground/settlement/hut-photos`, `ephemeral-ground/settlement/isometric-model`, `ephemeral-ground/settlement/kitchen-elevation`, `ephemeral-ground/settlement/kitchen-key`, `ephemeral-ground/settlement/kitchen-plans`, `ephemeral-ground/settlement/materials`, `ephemeral-ground/settlement/residential-plan`, `ephemeral-ground/settlement/small-unit`, `ephemeral-ground/settlement/street-elevation`, `ephemeral-ground/settlement/visitors-plan`, `ephemeral-ground/settlement/visitors-section`, `ephemeral-ground/settlement/walkway-sketch`, `home/preloader/2021`, `home/preloader/2022`, `home/preloader/2023`, `home/preloader/2024`, `home/preloader/2025`, `home/preloader/2026`
