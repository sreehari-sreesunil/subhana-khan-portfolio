import { ephemeralGroundPreview as home } from "./home";
import { images, type ImageName } from "./ephemeral-ground.images";

// Skeleton for /work/ephemeral-ground. See docs/ephemeral-ground-plan.md.
// Text marked "// PSD" is copied exactly from her editable layers. Text from pp.07–22 exists only as
// flattened page images: it's added section by section from OCR, proofread line by line against the
// page, and each block is then marked "// OCR, proofread". Typos stay until approved.

export { images };

export type EgImage = {
  name: ImageName;
  alt: string;
  /** Portrait crop of the best detail, for phones. Added in the mobile pass. */
  mobile?: ImageName;
  /** Third-party material only. */
  credit?: string;
};

/** One photo in a masonry sheet: its credit is the group's. */
type EgPhoto = { name: ImageName; alt: string; figure: string };

/** An image on a living sheet, with its number. */
export type EgFigure = EgImage & { figure: string };

/** One zone on 1.4's map and its key. */
export type ZoneId = "campbell" | "galathea" | "port" | "airport" | "township" | "power";

/** Her bold words, kept. */
export type TextPart = { text: string; bold?: boolean };

export type EgSection = {
  id: string;
  title?: string;
  /** Printed page numbers. */
  pages: number[];
  images: EgImage[];
  text?: string[];
};

export type EgAct = {
  id: string;
  number: string;
  /** Shown in the sticky act navigator. */
  navLabel: string;
  question: string;
  pages: number[];
  sections: EgSection[];
};

const TO_CONFIRM = "Source to confirm";
const PHOTOGRAPHER_TO_CONFIRM = "Photographer to confirm";

export const credits = { coastline: home.mapCredit };

/** Numbers one section's figures, in the order this is called: "Fig. 2.2.1 — Hartmut Rosa". */
function figures(section: string) {
  let number = 0;
  return (title: string) => `Fig. ${section}.${++number} — ${title}`;
}

export const opening = {
  numeral: "01",
  title: "EPHEMERAL GROUND",
  // PSD. "BUILT AREA" is left out because it's blank on her page.
  facts: [
    { label: "PROJECT TYPE", value: "Township" },
    { label: "LOCATION", value: "The Great Nicobar Island Project" },
    { label: "SITE AREA", value: "100acre." },
    { label: "PRIMARY USERS", value: "Long term residencts" },
    { label: "SECONDARY USERS", value: "Tourists/short term visitors" },
  ],
  briefHeading: "PROJECT BRIEF",
  // PSD
  brief:
    "Shared Territories explores an alternative model of settlement for ecologically sensitive island environments. It envisions a community of voluntary residents living through shared resources, collective land stewardship and a nature-embedded lifestyle. By treating the settlement as a network of small, replicable ecosystems rather than a single expanding township, the project explores how human habitation, ecological regeneration and economic activity can coexist.",
};

const fig11 = figures("1.1");
const fig12 = figures("1.2");
const fig13 = figures("1.3");
const fig14 = figures("1.4");
const fig15 = figures("1.5");
const fig16 = figures("1.6");

// Act 1 (pp.07–08). Stops are in the map's units; scale is relative to the map covering the screen.
export const act1 = {
  coastlineCredit: credits.coastline,
  // Her printed page numbers.
  sheets: { island: "07", stake: "08" },
  stops: [
    { center: { x: 500, y: 327 }, scale: 1, focus: { x: 500, y: 327 } },
    // Wider than a true close-up: the arc and the strait need about 400 units of height between them.
    // The arc sits just right of this stop's card, on the left, with the strait across the rest of the view.
    { center: { x: 615, y: 243 }, scale: 1.4, focus: { x: 615, y: 243 } },
    // The island sits left of centre, clear of the cards. `focus` centres it in the static frame.
    { center: { x: 593.4, y: 284 }, scale: 24, focus: { x: 585.5, y: 282 } },
  ],
  ocean: {
    figure: fig11("Indian Ocean"),
    // OCR, proofread
    text: "The Andaman and Nicobar Islands are a remote archipelago in the eastern Indian Ocean, stretching over 800 km between the Bay of Bengal and the Andaman Sea. With rich biodiversity and fragile ecosystems, their proximity to the strategically important Malacca Strait gives the islands significant ecological, geopolitical and maritime importance, shaping growing development interests in the region.",
  },
  strait: {
    frameAlt: "Map of the Andaman and Nicobar Islands and the Malacca Strait.",
    windowFigure: fig12("Andaman and Nicobar Islands, Strait of Malacca"),
    title: "Strait of Malacca",
    // OCR, proofread
    text: "The Malacca Strait is one of the world’s most critical maritime trade routes, connecting the Indian and Pacific Oceans and carrying a significant share of global shipping and energy transport. Its proximity to the Andaman and Nicobar Islands gives the region strategic importance in terms of trade, defence, and maritime security. This location has played a key role in shaping recent development interests in the islands.",
    image: { name: "island/malacca-map", alt: "Map of the Strait of Malacca between Malaysia and Sumatra.", credit: TO_CONFIRM, figure: fig12("Strait of Malacca") } satisfies EgFigure,
  },
  people: {
    frameAlt: "Map of Great Nicobar and Little Nicobar.",
    windowFigure: fig13("Great Nicobar"),
    title: "INTRODUCTION",
    subtitle: "Patai Takaru’s people",
    // OCR, proofread
    text: "The Nicobarese inhabit Great Nicobar’s coastal regions, relying on fishing, coconut cultivation and inter-island exchange, while communal ownership shapes their relationship with the land. The Shompen live in small, dispersed groups within the island’s interior forests, relying on generations of knowledge of forests, rivers and wildlife, and adapting their movements to seasonal changes.",
    dwellingTitle: "Pattern of dwelling",
    huts: [
      { name: "island/dwelling-hut-a", alt: "Archival photograph of a thatched dome hut.", credit: TO_CONFIRM, figure: fig13("Thatched dome hut") },
      { name: "island/dwelling-hut-b", alt: "Archival photograph of a thatched hut on stilts.", credit: TO_CONFIRM, figure: fig13("Hut on stilts") },
    ] satisfies EgFigure[],
  },
  proposal: {
    title: "The Great Nicobar Development Proposal",
    windowFigure: fig14("Proposed development zones, redrawn approximately from maps on her sheets 07 and 09"),
    windowAlt: "Map of Great Nicobar with the proposed development zones drawn over it.",
    map: {
      name: "island/proposal-map",
      alt: "Zoning map of the proposed development on Great Nicobar.",
      credit: "Based on NITI Aayog, Holistic Development of Great Nicobar Island",
      figure: fig14("Development zones, as published"),
    } satisfies EgFigure,
    // In reveal order. Names and numbers as printed on her p.07 map.
    zones: [
      { id: "campbell", label: "Campbell Bay National Park" },
      { id: "galathea", label: "Galathea National Park" },
      { id: "port", marker: 1, label: "International Container Transhipment Terminal" },
      { id: "airport", marker: 2, label: "International Airport" },
      { id: "township", marker: 3, label: "Township and Area Development" },
      { id: "power", marker: 4, label: "Power Plant" },
    ] as { id: ZoneId; marker?: number; label: string }[],
    scaleTitle: "Scale of development",
    // OCR, proofread
    scale: [
      { value: "166 sq.km", label: "Total project area" },
      { value: "6000+ ha", label: "Land to be developed" },
      { value: "300,000+", label: "Incoming population" },
      { value: "Large scale", label: "Reclamation & dredging" },
    ],
    // OCR, proofread
    populationFrom: "7300 (approx)",
    populationTo: "3,00,000 (approx)",
    // OCR, proofread
    population: [
      { value: "1600", label: "Native people", note: "(Shompen & Nicobarese)" },
      { value: "5700", label: "Settlers", note: "(Old immigrants)" },
      { value: "300,000", label: "Proposed", note: "(New population)" },
    ],
    // OCR, proofread
    projects: [
      {
        icon: "island/icon-airport",
        title: "Greenfield International Airport",
        text: ["New civilian airport with peak capacity for ~4,000 passengers.", "Enhances air connectivity and can support strategic air operations."],
      },
      {
        icon: "island/icon-township",
        title: "Smart Township & Tourism Infrastructure",
        text: ["Urban development for ~300,000 people (workforce & residents).", "Includes housing, roads, public utilities, and tourism facilities."],
      },
      {
        icon: "island/icon-terminal",
        title: "International Container Transshipment Terminal",
        text: ["At Galathea Bay on the east coast.", "Designed with ~16 million TEU capacity (first phase ~4 million TEUs)."],
      },
      {
        icon: "island/icon-power",
        title: "Power Plant (Gas + Solar)",
        text: ["~450 MVA power capacity combining gas and solar power assets.", "To supply electricity for new infrastructure."],
      },
    ] satisfies { icon: ImageName; title: string; text: string[] }[],
    iconsCredit: `Icons: ${TO_CONFIRM.toLowerCase()}`,
  },
  // OCR, proofread
  stake: [
    {
      title: "Biodiversity loss",
      text: "The proposed clearance of nearly 8.5 lakh trees in Great Nicobar raises concerns beyond local biodiversity. As India faces rising temperatures and heatwaves, losing one of its last intact tropical rainforests threatens carbon storage, climate regulation and ecological resilience, highlighting the conflict between development and long-term environmental stability.",
      images: [
        { name: "island/trees-graphic", alt: "News graphic of Great Nicobar's coast from the air.", credit: TO_CONFIRM, figure: fig15("Great Nicobar coast") },
        { name: "island/heat-map", alt: "Land surface temperature map of India.", credit: TO_CONFIRM, figure: fig15("Land surface temperature") },
      ],
    },
    {
      title: "Leatherback Turtle Nesting Grounds",
      text: "The proposed transshipment port is located near Galathea Bay, one of the world’s most significant nesting sites for the endangered Leatherback Sea Turtle. Increased coastal activity, artificial lighting and habitat alteration may disrupt nesting and hatching cycles.",
      images: [{ name: "island/port-map", alt: "Map of the proposed port near Galathea Bay.", credit: TO_CONFIRM, figure: fig15("Proposed port, Galathea Bay") }],
    },
    {
      title: "Ecological Fragility",
      text: "Great Nicobar’s limited freshwater and finite resources make it vulnerable to rapid population growth and rising demand. Its seismic activity and sensitive coastal, forest and river ecosystems further increase the risks of large-scale land transformation, threatening ecological resilience and long-term resource security.",
      images: [{ name: "island/section-sketch", alt: "Drawn section through forest, wetland and shore.", figure: fig15("Section through forest, wetland and shore") }],
    },
    {
      title: "Impact of population influx",
      text: "Large-scale migration in the Andaman and Nicobar Islands brought disease, resource competition and cultural disruption, contributing to severe population declines among communities such as the Great Andamanese and Onge. These pressures threaten Indigenous languages, traditional knowledge and cultural survival.",
      images: [],
      source: "Subir Bhaumik, “Measles hits rare Andaman tribe”, BBC News, 16 May 2006",
      numbersFigure: fig15("Population, existing to proposed"),
    },
  ] as { title: string; text: string; images: EgFigure[]; source?: string; numbersFigure?: string }[],
  lessons: {
    title: "Lessons from earlier interventions",
    // OCR, proofread
    text: "Infrastructure, logging, plantations and settlement schemes fragmented Indigenous territories across the Andaman and Nicobar Islands, restricting access to traditional lands and resources. These interventions disrupted established livelihoods and increased exposure to outsiders, disease and dependence on external support.",
    tableCaption: fig16("Population of Andaman Islands communities by census year, 1901 to 2011."),
    tableCredit: TO_CONFIRM,
    tableHead: ["Year", "Great Andamanese", "Onge", "Jarawa", "Sentinelese*", "Total", "Growth rate"],
    // Read by eye: OCR can't read this table. In every row the four groups add up to her total.
    tableRows: [
      ["1901", "625", "672*", "585*", "117", "1999", "–"],
      ["1911", "455", "631*", "114*", "117", "1317", "-34.12"],
      ["1921", "209", "346*", "114*", "117", "786", "-40.32"],
      ["1931", "90", "250*", "70*", "50", "460", "-41.47"],
      ["1941", "–", "–", "–", "–", "–", "–"],
      ["1951", "23", "150*", "50*", "50", "273", "-40.65"],
      ["1961", "19", "129", "500*", "50", "698", "155.6"],
      ["1971", "24", "112", "250*", "82", "468", "-32.95"],
      ["1981", "26", "97", "250*", "100", "473", "1.01"],
      ["1991", "45", "95", "280*", "100", "520", "9.93"],
      ["2001", "43", "96", "240", "39", "418", "-19.61"],
      ["2011", "54", "101", "380", "15", "–", "–"],
    ],
    maps: { name: "island/island-maps", alt: "Three maps of the Andaman Islands in 1957, 1979 and 2004.", credit: TO_CONFIRM, figure: fig16("Andaman Islands in 1957, 1979 and 2004") } satisfies EgFigure,
  },
};

// Act 2 (pp.23, 24, 11, 12). Text is from her PSD layers unless marked OCR.
const fig22 = figures("2.2");
const fig25 = figures("2.5");
const fig26 = figures("2.6");
const fig35 = figures("3.5");

export const act2 = {
  question: "WHAT IS SLOWNESS IN DESIGN?",
  // PSD
  definition:
    "Slowness in design is not inactivity, but intentional architecture that values people, place and time over speed and quantity. Through human-scaled spaces, shared courtyards and shaded transitions, architecture encourages pause, interaction and meaningful everyday experiences.",
  walker: { name: "idea/walker", alt: "A lone figure walking, leaving a line of footprints." } satisfies EgImage,
  tree: { name: "idea/lone-tree", alt: "A single tree standing on its own." } satisfies EgImage,
  philosophersSheet: "23",
  philosophersTitle: "PHILOSOPHICAL PERSPECTIVES",
  // PSD, with her bold kept.
  philosophers: [
    {
      name: "Hartmut Rosa",
      figure: fig22("Hartmut Rosa"),
      image: { name: "idea/arch-rosa", alt: "Arched collage of a crowd, a phone, and people connected across a forest walkway.", credit: TO_CONFIRM },
      caption: [
        { text: "Resonance over Acceleration", bold: true },
        { text: " shapes slower, more intentional living through spaces that foster meaningful connections between people, place and nature." },
      ],
    },
    {
      name: "Juhani Pallasmaa",
      figure: fig22("Juhani Pallasmaa"),
      image: { name: "idea/arch-pallasmaa", alt: "Arched collage of a portrait of Pallasmaa, a stone wall and a child curled inside a hollow rock.", credit: TO_CONFIRM },
      caption: [
        { text: "Architecture creates " },
        { text: "multi-sensory experiences", bold: true },
        { text: " through material, sound, smell, light and texture, fostering emotional engagement and attachment to place." },
      ],
    },
    {
      name: "Jun’ichirō Tanizaki",
      figure: fig22("Jun’ichirō Tanizaki"),
      image: { name: "idea/arch-tanizaki", alt: "Arched collage of a portrait of Tanizaki, a temple roof, paper lanterns and shoji screens at dusk.", credit: TO_CONFIRM },
      caption: [
        { text: "In praise of shadows,", bold: true },
        { text: " filtered daylight reveals the subtle qualities of space, creating intimate environments for contemplation and connection with nature." },
      ],
    },
    {
      name: "Peter Zumthor",
      figure: fig22("Peter Zumthor"),
      image: { name: "idea/arch-zumthor", alt: "Arched collage of a portrait of Zumthor, cupped hands, a stone labyrinth and a large leaf.", credit: TO_CONFIRM },
      caption: [
        { text: "Atmosphere and emotion", bold: true },
        { text: " emerge through light, material and proportion, shaping memorable spaces that foster comfort, belonging and well-being." },
      ],
    },
  ] as { name: string; figure: string; image: EgImage; caption: TextPart[] }[],
  neuroscienceTitle: "NEUROSCIENTIFIC PERSPECTIVES",
  // PSD
  tiles: [
    {
      title: "Stress & Cognitive Load",
      text: "Calm spaces reduce stress and support focus and clarity.",
      image: { name: "idea/neuro-stress", alt: "Collage of a crowded street.", credit: TO_CONFIRM },
    },
    {
      title: "Sensory Balance",
      text: "Balanced sensory elements foster comfort and emotional regulation.",
      image: { name: "idea/neuro-sensory", alt: "Collage of a calm sheltered terrace.", credit: TO_CONFIRM },
    },
    {
      title: "Nature & Attention Restoration",
      text: "Nature restores attention, reduces stress and encourages slower experiences.",
      image: { name: "idea/neuro-nature", alt: "Collage of a forest and a circular pool.", credit: TO_CONFIRM },
    },
    {
      title: "Neuroarchitecture",
      text: "Architecture shapes behaviour, emotion and well-being.",
      image: { name: "idea/neuro-architecture", alt: "Collage of a city map with marked points.", credit: TO_CONFIRM },
    },
    {
      title: "Spatial Legibility & Belonging",
      text: "Clear layouts strengthen orientation, memory and belonging.",
      image: { name: "idea/neuro-legibility", alt: "Collage of a courtyard house.", credit: TO_CONFIRM },
    },
    {
      title: "Environmental Responsiveness",
      text: "Climate-responsive design supports comfort and sustainable living.",
      image: { name: "idea/neuro-environment", alt: "Collage of a brain beneath a concrete building.", credit: TO_CONFIRM },
    },
  ] as { title: string; text: string; image: EgImage }[],
  caseStudies: {
    title: "CASE STUDIES",
    label: "Case studies",
    hint: "Scroll sideways",
    // Measured from her p.24. Positions are % of the strip; each has room above the image for her captions.
    strips: [
      {
        ratio: 2152 / 853,
        image: { name: "idea/case-brion", alt: "Concrete walls, water and planting at Brion Cemetery.", credit: "Carlo Scarpa. Photographer to confirm" },
        // PSD, with her bold kept.
        captions: [
          {
            left: 5.6,
            top: 17.8,
            width: 26,
            parts: [
              { text: "Movement through " },
              { text: "Brion Cemetery", bold: true },
              { text: " is slow and non-linear, revealing spaces gradually and encouraging discovery." },
            ],
          },
          { left: 39.7, top: 3.3, width: 24.6, parts: [{ text: "Concrete, stone, water and vegetation embrace weathering and ageing, allowing architecture to reflect the passage of time." }] },
          { left: 50.9, top: 37, width: 23.7, parts: [{ text: "Alternating enclosure and openness guide visitors through a reflective journey of mourning." }] },
          { left: 77.1, top: 9.6, width: 21.4, parts: [{ text: "Thresholds, level changes and framed openings mark transitions, slowing movement and heightening awareness of each crossing." }] },
        ],
      },
      {
        ratio: 1209 / 853,
        image: { name: "idea/case-brick", alt: "A brick stair, a timber bench and a braided door handle.", credit: TO_CONFIRM },
        // PSD
        captions: [
          { left: 3, top: 2.7, width: 30, line: { left: 1.8, top: 2.7, height: 39 }, parts: [{ text: "The braided leather handle creates a tactile memory while preventing the metal from feeling cold in winter." }] },
          { left: 36, top: 0, width: 34, line: { left: 34.6, top: 0, height: 38 }, parts: [{ text: "A gradual ascent through brick-lined stairways and shifting clerestory light slows movement and prepares occupants for collective decision-making." }] },
          { left: 75.9, top: 14.4, width: 24, line: { left: 74.6, top: 14.4, height: 24 }, parts: [{ text: "The seat has inbuilt heaters so that users feel comfortable." }] },
        ],
      },
    ] as {
      ratio: number;
      image: EgImage;
      captions: { left: number; top: number; width: number; line?: { left: number; top: number; height: number }; parts: TextPart[] }[];
    }[],
  },
  applicationSheet: "24",
  applicationTitle: "APPLICATION",
  // PSD
  application: [
    {
      name: "Library Building",
      figure: fig25("Library Building"),
      image: { name: "idea/render-library", alt: "Render of a figure seated at a reflecting pool facing the sea, above a dark hall opening through a narrow slit." },
      text: "A narrow slit compresses perception before opening onto a sheltered verandah and reflecting pool that extends the horizon. The low ceiling offers refuge within the vast landscape, creating pause through anticipation, wonder and framed views.",
    },
    {
      name: "Community Hall",
      figure: fig25("Community Hall"),
      image: { name: "idea/render-hall", alt: "Render of a community hall on stilts above a stone landscape." },
      text: "The community hall’s elevated auditorium establishes monumentality, while stone landscapes and tactile surfaces bring the ground to a human scale, transforming awe into familiarity through touch and movement.",
    },
    {
      name: "Residential Building",
      figure: fig25("Residential Building"),
      image: { name: "idea/render-residential", alt: "Render of a woman on a sheltered balcony." },
      text: "Sheltered balconies frame views of the landscape and community, offering refuge for pause and observation, while cluster orientation connects homes to the surrounding landscape and shared courtyard, encouraging interaction and strengthening belonging.",
    },
    {
      name: "Incremental Housing",
      figure: fig25("Incremental Housing"),
      image: { name: "idea/render-housing", alt: "Painted elevation of a timber house." },
      text: "Residential units are conceived as incremental frameworks capable of growth, contraction and modification over time. Rather than prescribing a fixed mode of living, the design acknowledges that homes must evolve alongside the changing needs of their inhabitants.",
    },
  ] as { name: string; figure: string; image: EgImage; text: string }[],
  island: {
    sheet: "11",
    window: { figure: fig26("Great Nicobar"), credit: credits.coastline },
    collage: {
      name: "idea/arch-collage",
      alt: "Arched collage of a whale, a turtle, a tree held by hands, and a hut.",
      figure: fig26("A different logic"),
    } satisfies EgImage & { figure: string },
    // OCR, proofread
    key: "The Great Nicobar development brings 300,000 people to one of the least disturbed rainforest landscapes in India. This neighbourhood of 1,000 – the teachers, doctors, shopkeepers and guides who make that development liveable – is designed on a different logic entirely. Not against development, but proposing that development can leave a place better than it found it. A settlement whose daily life is its ecology.",
    // PSD
    closing:
      "Island development must balance ecological limits, biodiversity, tourism and local livelihoods through slow, context-sensitive design that protects nature and strengthens resilient communities.",
    // OCR, proofread
    diagrams: [
      {
        figure: fig26("Slope Ratio"),
        image: { name: "idea/slope-ratio", alt: "Isometric diagram of the site's slopes, with the high contours marked." },
        text: [
          "The community buildings are positioned in the high contours as a protective measure against tsunami or flooding that the site is prone to.",
          "The permanent built structures are built away from the ocean.",
        ],
      },
      { figure: fig26("Terrain"), image: { name: "idea/terrain", alt: "Isometric diagram of the site's terrain." }, text: [] },
      { figure: fig26("Accessibility"), image: { name: "idea/accessibility", alt: "Isometric diagram of the site's access, with the road, zones and nearest town marked." }, text: [] },
    ] as { figure: string; image: EgImage; text: string[] }[],
  },
  strategies: {
    title: "STRATEGIES",
    // OCR, proofread. Order follows the grid: Defence, Social, then Environment, Economy.
    quadrants: [
      {
        label: "DEFENCE",
        items: [
          {
            text: "Canopy as camouflage. Retained tree cover reduces the settlement’s thermal and visual signature from aerial surveillance. The settlement remains forest from above.",
            image: { name: "idea/strategy-canopy", alt: "Watercolour of a settlement under a tree canopy." },
          },
          {
            text: "Tsunami evacuation by design. The community tower sits on the highest ridge in the settlement. All cluster paths lead toward it. When evacuation is needed, people don’t need to be told where to go – their daily movement has already taught them. Safety becomes instinct, not instruction.",
            image: { name: "idea/strategy-tower", alt: "Watercolour of an evacuation tower among trees." },
          },
          {
            text: "Natural buffers as boundary. The regenerating forest edge between the settlement and the defence zone acts as a passive, living restriction. No wall, no fence – the forest itself marks the limit.",
            image: { name: "idea/strategy-buffer", alt: "Watercolour of a forest edge." },
          },
        ],
      },
      {
        label: "SOCIAL",
        items: [
          {
            text: "Intentional exclusion of tribal territory. The Shompen people’s land is not a design opportunity. Site selection deliberately avoids all marked Nicobarese settlements. The forest buffer ensures no social or physical encroachment over time.",
            image: { name: "idea/strategy-locator", alt: "Small locator map of Great Nicobar." },
          },
          {
            text: "Forced adjacency through architecture. The shared verandah, community kitchen, and hollow are not optional amenities – they are the primary circulation and social infrastructure. To move through the settlement is to encounter your neighbours.",
            image: { name: "idea/strategy-steps", alt: "Sketch of people on a shared stepped street." },
          },
          {
            text: "Local ecological knowledge of the island is treated as expertise. Residents are trained in forest stewardship, seasonal water management, and island ecology by those who already understand it – not by imported consultants.",
            image: { name: "idea/strategy-exchange", alt: "Sketch of residents sharing knowledge." },
          },
        ],
      },
      {
        label: "ENVIRONMENT",
        items: [
          {
            text: "Terrain-led placement. Cluster positions determined by slope analysis, drainage corridors, and existing canopy gaps. The land decides where buildings go.",
            image: { name: "idea/strategy-terrain", alt: "Watercolour of a building set into a slope." },
          },
          {
            text: "Wetland and vegetation conservation. Three distinct zones – littoral forest, mangrove wetland, and rainforest – are mapped and protected absolutely. No structure enters any vegetation zone boundary.",
            image: { name: "idea/strategy-wetland", alt: "Watercolour section of wetland and rainforest." },
          },
          {
            text: "Passive climate response. Orientation, cross ventilation, butterfly roofs, and raised construction respond to the tropical climate without mechanical systems. The building breathes with the island.",
            image: { name: "idea/strategy-climate", alt: "Watercolour of a raised house with a butterfly roof." },
          },
        ],
      },
      {
        label: "ECONOMY",
        items: [
          {
            text: "Resident-run tourism cooperative. All tourism income – visitor entry, guiding, market sales, short stays – flows through a community cooperative. Money stays within the neighbourhood.",
            image: { name: "idea/strategy-market", alt: "Watercolour of a covered market." },
          },
          {
            text: "Resource self-sufficiency. Water harvested from roofs. Energy from solar. Food from productive agriculture without land clearing. The settlement minimises its dependency on external supply chains.",
            image: { name: "idea/strategy-water", alt: "Watercolour section of a rainwater pond." },
          },
          {
            text: "Gateway to undiscovered India. Great Nicobar sits on one of the world’s busiest shipping lanes yet remains virtually unknown to international tourism. This settlement positions itself to attract the global sailing community, eco-tourists, and adventure travellers – a market largely untapped in India. The neighbourhood becomes the first point of contact for a form of tourism the country has not yet formalised.",
            image: { name: "idea/strategy-boat", alt: "Painting of a sailing boat." },
          },
        ],
      },
    ] as { label: string; items: { text: string; image: EgImage }[] }[],
  },
};

const fig31 = figures("3.1");
const fig32 = figures("3.2");
const fig34 = figures("3.4");

// Act 3 (pp.09–10). Nothing here is in the PSD.
export const act3 = {
  scrollHint: "Scroll sideways",
  // Her printed page numbers.
  sheets: { maps: "09", plan: "10" },
  landAnalysis: {
    maps: [
      {
        name: "ground/tribal-map",
        alt: "Map of tribal areas, forest and national parks on Great Nicobar.",
        credit: "Dr M. Chandi, ANTRI RAC, with A&N Forest Dept GIS cell, 2018",
        figure: fig31("Tribal areas and national parks"),
      },
      {
        name: "ground/project-land-map",
        alt: "Map of the land within the project area.",
        credit: "NITI Aayog, Holistic Development of Great Nicobar Island",
        figure: fig31("Land Details Within the Project Area"),
      },
      { name: "ground/land-use-map", alt: "Map of proposed land use.", credit: TO_CONFIRM, figure: fig31("Proposed land use") },
    ] satisfies EgFigure[],
    // OCR, proofread
    text: "The land use analysis reveals a major shift in Great Nicobar, from predominantly protected forests and indigenous settlements to a development-oriented landscape shaped by the proposed port, airport and township. Changes to protected zones and the reclassification of native village lands raise concerns about ecological loss and the displacement of existing communities.",
  },
  settlements: {
    label: "The settlements",
    image: { name: "ground/settlements-strip", alt: "Hand-coloured strip of the coast with its settlements circled and joined by the road.", figure: fig32("The settlements") } satisfies EgFigure,
    // OCR, proofread
    text: "Six potential locations were assessed based on institutional proximity, tourism potential, access to infrastructure, ecological sensitivity, suitability for forest-edge development and compatibility with indigenous land rights. The assessment aimed to identify a location that balances user accessibility with minimal environmental disturbance and respect for existing communities.",
    // Where her names sit, as % of the strip.
    names: [
      { name: "Campbell Bay", left: 0.6, top: 5 },
      { name: "Govind Nagar", left: 16.7, top: 15.2 },
      { name: "Joginder Nagar", left: 24.9, top: 1.5 },
      { name: "Laxmi Nagar", left: 53.7, top: 43 },
      { name: "Gandhi Nagar", left: 73.1, top: 27.7 },
      { name: "Shastri Nagar", left: 87.1, top: 25.6 },
    ],
  },
  site: {
    /** On her outline at the Campbell Bay coast (`home.site.story`). */
    stop: { center: { x: 587.3, y: 284.05 }, scale: 80 },
    frameAlt: "The coast at Campbell Bay on Great Nicobar, with the site outlined in red dots.",
    // OCR, proofread
    text: "Located near Campbell Bay, Great Nicobar’s main urban centre, the site is surrounded by an educational campus, housing, agricultural land and established road networks. Nearby markets, schools, healthcare, administrative offices and recreational facilities provide essential amenities, offering a connected base for a nature-integrated neighbourhood.",
  },
  plan: {
    title: "Site plan",
    image: { name: "ground/contour-plan", alt: "Site plan with contours, water catchments and the coast.", figure: fig34("Site plan") } satisfies EgFigure,
    keyPlanFigure: fig34("Key plan: site location"),
    // OCR, proofread
    data: [
      "Site area- 100 acres",
      "Contour intervals - 1m",
      "Elevation - 35m",
      "Ecological footprint - Zero-disruption to Mangrove & Wetland Corridors",
    ],
    legend: ["Bay of Bengal", "Laxman beach", "Water catchment basin", "Access road", "Wetland", "Forest"],
    wind: ["Wind from North-west", "Wind from South-west"],
    layout:
      "The layout follows the natural topography, placing buildings within existing clearings and higher contours while preserving drainage channels and water catchments. Institutional zones are positioned near access routes, allowing the inner site to retain forest and wetland corridors. Shaded pedestrian connections integrate daily movement with the natural landscape while minimising ecological disturbance.",
    transect:
      "The transect shows the transition from the island’s interior forests to the Bay of Bengal coast. The layout follows the natural contours, preserving water catchments, wetlands and coastal ecosystems while integrating low-impact buildings and pedestrian connections.",
  },
  context: {
    sitePhotosSheet: "10",
    infrastructure: {
      title: "Infrastructure",
      credit: PHOTOGRAPHER_TO_CONFIRM,
      list: [
        { name: "ground/infra-1", alt: "A two-storey white building with a blue roof.", figure: fig35("Two-storey building") },
        { name: "ground/infra-2", alt: "A lawn, a path and low buildings under a large tree.", figure: fig35("Lawn and path") },
        { name: "ground/infra-3", alt: "A man walking through a gate along a footpath, beneath a pale pink sun and a flock of birds.", figure: fig35("Gate and footpath") },
        { name: "ground/infra-4", alt: "A shop hung with clothes and bags.", figure: fig35("Shop") },
        { name: "ground/infra-5", alt: "A person leaning on a blue railing beside a large playing field.", figure: fig35("Playing field") },
        { name: "ground/infra-6", alt: "A brightly painted temple with a tall yellow flagstaff.", figure: fig35("Temple") },
      ] satisfies EgPhoto[],
    },
    section: {
      title: "Site section",
      image: { name: "ground/site-section", alt: "Long section from the interior forest to the coast." } satisfies EgImage,
    },
    map: {
      title: "Site context",
      image: { name: "ground/site-context", alt: "Map of the site's surroundings with a satellite inset.", credit: "Satellite imagery: provider to confirm" } satisfies EgImage,
      // OCR, proofread
      key: ["Selected site", "Educational campus", "Apartment society", "INS Baaz", "Port", "Residential area"],
    },
    photos: {
      title: "Site photos",
      credit: PHOTOGRAPHER_TO_CONFIRM,
      list: [
        { name: "ground/site-1", alt: "Aerial view of forest canopy, with white line drawings of circles laid over it.", figure: fig35("Forest canopy") },
        { name: "ground/site-2", alt: "Aerial view of forest meeting a pale rocky shore.", figure: fig35("Rocky shore") },
        { name: "ground/site-3", alt: "Aerial view of a road curving between bare ground and forest.", figure: fig35("Road and forest") },
        { name: "ground/site-4", alt: "Aerial view of mangroves at the edge of a mudflat.", figure: fig35("Mangroves") },
        { name: "ground/site-5", alt: "Aerial view of a curved white beach and turquoise water below forest.", figure: fig35("Beach") },
        { name: "ground/site-6", alt: "Aerial view of a tidal creek with palms along its bank.", figure: fig35("Tidal creek") },
      ] satisfies EgPhoto[],
    },
    keyPlan: {
      heading: "Key Plan",
      image: { name: "ground/site-context", alt: "Her map of the site's surroundings, with the selected site boxed.", credit: "Satellite imagery: provider to confirm" } satisfies EgImage,
      figure: fig35("Key plan: site location"),
      // Round the block marked 1 on her map.
      area: { left: 0.02, top: 0.16, width: 0.09, height: 0.17 },
    },
  },
};

/** The title block's fixed words, on every living sheet. */
export const sheetLabels = { project: "Ephemeral Ground", sheet: "Sheet", scale: "Scale", north: "North" };

export const acts: EgAct[] = [
  {
    id: "act-1",
    number: "01",
    navLabel: "THE ISLAND",
    question: "Why here, and what is at stake?",
    pages: [7, 8],
    // Built from `act1` below.
    sections: [],
  },
  {
    id: "act-2",
    number: "02",
    navLabel: "THE IDEA",
    question: "What is slowness in design?",
    pages: [23, 24, 11, 12],
    // Built from `act2` above.
    sections: [],
  },
  {
    id: "act-3",
    number: "03",
    navLabel: "THE GROUND",
    question: "Where exactly?",
    pages: [9, 10],
    // Built from `act3` above.
    sections: [],
  },
  {
    id: "act-4",
    number: "04",
    navLabel: "THE SETTLEMENT",
    question: "What did she design?",
    pages: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    sections: [
      {
        id: "everything-passes",
        pages: [13],
        images: [{ name: "settlement/opening-collage", alt: "Collage of a child watching a shared street." }],
      },
      {
        id: "planning-type",
        title: "PLANNING TYPE",
        pages: [13],
        images: [
          { name: "settlement/forest-aerial", alt: "Aerial view of the forest." },
          { name: "settlement/cluster-diagram", alt: "Diagram of a residential cluster around a shared centre." },
          { name: "settlement/isometric-model", alt: "Isometric model of the community buildings." },
        ],
      },
      {
        id: "masterplan",
        title: "MASTERPLAN",
        pages: [15],
        images: [{ name: "settlement/masterplan", alt: "Colour masterplan of the 100-acre site, with lake and coast." }],
      },
      { id: "design-program", title: "DESIGN PROGRAM", pages: [13], images: [] },
      {
        id: "tsunami",
        title: "TSUNAMI RESILIENT DESIGN",
        pages: [14],
        images: [
          { name: "settlement/tsunami-render", alt: "Render of a landmark tower above the coast." },
          { name: "settlement/tsunami-zoning", alt: "Zoning plan of the settlement." },
        ],
      },
      {
        id: "eight-strategies",
        pages: [16],
        images: [
          { name: "settlement/strategy-water", alt: "Sketch section of a water catchment." },
          { name: "settlement/strategy-gradient", alt: "Sketch of a public-to-private gradient." },
          { name: "settlement/strategy-ecology", alt: "Sketch section of preserved wetland." },
          { name: "settlement/strategy-layout", alt: "Diagram of scattered buildings." },
          { name: "settlement/strategy-walkability", alt: "Sketch of a shaded path." },
          { name: "settlement/strategy-resilience", alt: "Section of layered coastal defences." },
          { name: "settlement/strategy-contour", alt: "Sketch of buildings stepping with contours." },
          { name: "settlement/strategy-roads", alt: "Diagram of the road network." },
        ],
      },
      {
        id: "site-section",
        pages: [16],
        images: [{ name: "settlement/site-section", alt: "Long section from the residential cluster to Laxman beach." }],
      },
      {
        id: "community-zone",
        title: "COMMUNITY ZONE",
        pages: [17, 18],
        images: [
          { name: "settlement/hall-models", alt: "Models of the community hall." },
          { name: "settlement/hall-plans", alt: "Stacked floor plans of the community hall." },
          { name: "settlement/kitchen-plans", alt: "Floor plans of the community kitchen." },
          { name: "settlement/kitchen-key", alt: "Key plan locating the community kitchen." },
          { name: "settlement/kitchen-elevation", alt: "Elevation of the community kitchen." },
        ],
      },
      {
        id: "tourism-zone",
        title: "TOURISM ZONE",
        pages: [21],
        images: [
          { name: "settlement/visitors-plan", alt: "Plan of the Visitor's Center and its shops." },
          { name: "settlement/visitors-section", alt: "Section through the Visitor's Center." },
          { name: "settlement/materials", alt: "Samples of rammed earth and timber." },
        ],
      },
      {
        id: "cultural-center",
        title: "CULTURAL CENTER",
        pages: [22],
        images: [
          { name: "settlement/cultural-plan", alt: "Plan of the Cultural Center." },
          { name: "settlement/cultural-key", alt: "Key plan locating the Cultural Center." },
          { name: "settlement/cultural-section", alt: "Section through the Cultural Center." },
        ],
      },
      {
        id: "residential-zone",
        title: "RESIDENTIAL ZONE",
        pages: [19],
        images: [
          { name: "settlement/residential-plan", alt: "Plan of the residential zone and its clusters." },
          { name: "settlement/hut-photos", alt: "Archival photographs of Nicobarese huts.", credit: TO_CONFIRM },
          { name: "settlement/commons-plan", alt: "Plan of the common laundry and kitchenette." },
          { name: "settlement/small-unit", alt: "Plan of a smaller unit." },
          { name: "settlement/apartment-plan", alt: "Apartment plan." },
          { name: "settlement/apartment-section", alt: "Apartment section." },
        ],
      },
      {
        id: "cluster",
        pages: [20],
        images: [
          { name: "settlement/cluster-residential", alt: "Residential cluster plan." },
          { name: "settlement/cluster-tourist", alt: "Cluster for tourists, plan." },
          { name: "settlement/walkway-sketch", alt: "Hand sketch of a connection between huts." },
          { name: "settlement/street-elevation", alt: "Painted elevation of houses among trees." },
        ],
      },
      {
        id: "family-unit",
        title: "Family units",
        pages: [19],
        images: [
          { name: "settlement/family-ground", alt: "Family unit, ground floor plan." },
          { name: "settlement/family-first", alt: "Family unit, first floor plan." },
        ],
      },
    ],
  },
];

// Cited in text. Their photographs are left out; see the plan, section 6.
export const textSources = [
  "Subir Bhaumik, “Measles hits rare Andaman tribe”, BBC News, 16 May 2006",
  "“Jarawa tribe now face sexual abuse by outsiders on Andaman Islands”. Publisher to confirm",
];
