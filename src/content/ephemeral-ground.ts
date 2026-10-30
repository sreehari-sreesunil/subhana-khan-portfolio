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

export const credits = { coastline: home.mapCredit };

// Camera stops, in the map's units. The scale is relative to the map covering the whole screen.
export const zoomStops = {
  ocean: { center: { x: 500, y: 327 }, scale: 1 },
  island: { center: { x: 585.5, y: 282 }, scale: 24 },
};

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

export const acts: EgAct[] = [
  {
    id: "act-1",
    number: "01",
    navLabel: "THE ISLAND",
    question: "Why here, and what is at stake?",
    pages: [7, 8],
    sections: [
      { id: "ocean", pages: [7], images: [] },
      {
        id: "strait-of-malacca",
        title: "Strait of malacca",
        pages: [7],
        images: [{ name: "island/malacca-map", alt: "Map of the Strait of Malacca between Malaysia and Sumatra.", credit: TO_CONFIRM }],
      },
      {
        id: "dwelling",
        title: "Pattern of dwelling",
        pages: [7],
        images: [
          { name: "island/dwelling-hut-a", alt: "Archival photograph of a thatched dome hut.", credit: TO_CONFIRM },
          { name: "island/dwelling-hut-b", alt: "Archival photograph of a thatched hut on stilts.", credit: TO_CONFIRM },
        ],
      },
      {
        id: "proposal",
        title: "The Great Nicobar Development Proposal",
        pages: [7],
        images: [
          {
            name: "island/proposal-map",
            alt: "Zoning map of the proposed development on Great Nicobar.",
            credit: "Based on NITI Aayog, Holistic Development of Great Nicobar Island",
          },
          { name: "island/proposal-icons", alt: "Icons for an airport, township, container terminal and power plant.", credit: TO_CONFIRM },
        ],
      },
      {
        id: "at-stake",
        pages: [8],
        images: [
          { name: "island/trees-graphic", alt: "News graphic of Great Nicobar's coast from the air.", credit: TO_CONFIRM },
          { name: "island/heat-map", alt: "Land surface temperature map of India.", credit: TO_CONFIRM },
          { name: "island/port-map", alt: "Map of the proposed port near Galathea Bay.", credit: TO_CONFIRM },
          { name: "island/section-sketch", alt: "Drawn section through forest, wetland and shore." },
        ],
      },
      {
        id: "lessons",
        title: "Lessons from earlier interventions",
        pages: [8],
        images: [{ name: "island/island-maps", alt: "Three maps of the Andaman Islands in 1957, 1979 and 2004.", credit: TO_CONFIRM }],
      },
    ],
  },
  {
    id: "act-2",
    number: "02",
    navLabel: "THE IDEA",
    question: "What is slowness in design?",
    pages: [23, 24, 11, 12],
    sections: [
      {
        id: "question",
        title: "WHAT IS SLOWNESS IN DESIGN?",
        pages: [23],
        images: [
          { name: "idea/walker", alt: "A lone figure walking, leaving a line of footprints." },
          { name: "idea/lone-tree", alt: "A single bare tree on an empty horizon." },
          { name: "idea/photo-strip", alt: "Collage strip of an island, its coast and a crowded street." },
        ],
        text: [
          // PSD
          "Slowness in design is not inactivity, but intentional architecture that values people, place and time over speed and quantity. Through human-scaled spaces, shared courtyards and shaded transitions, architecture encourages pause, interaction and meaningful everyday experiences.",
          // PSD
          "Island development must balance ecological limits, biodiversity, tourism and local livelihoods through slow, context-sensitive design that protects nature and strengthens resilient communities.",
        ],
      },
      {
        id: "philosophers",
        title: "PHILOSOPHICAL PERSPECTIVES",
        pages: [23],
        images: [{ name: "idea/philosophers", alt: "Four arched collages for four thinkers on slowness.", credit: TO_CONFIRM }],
        // PSD: name, then text, for each arch.
        text: [
          "Hartmut Rosa",
          "Resonance over Acceleration shapes slower, more intentional living through spaces that foster meaningful connections between people, place and nature.",
          "Juhani Pallasmaa",
          "Architecture creates multi-sensory experiences through material, sound, smell, light and texture, fostering emotional engagement and attachment to place.",
          "Jun'ichirō Tanizaki",
          "In praise of shadows, filtered daylight reveals the subtle qualities of space, creating intimate environments for contemplation and connection with nature.",
          "Peter Zumthor",
          "Atmosphere and emotion emerge through light, material and proportion, shaping memorable spaces that foster comfort, belonging and well-being.",
        ],
      },
      {
        id: "neuroscience",
        title: "NEUROSCIENTIFIC PERSPECTIVES",
        pages: [23],
        images: [
          { name: "idea/neuro-stress", alt: "Collage of a crowded street.", credit: TO_CONFIRM },
          { name: "idea/neuro-sensory", alt: "Collage of a calm sheltered terrace.", credit: TO_CONFIRM },
          { name: "idea/neuro-nature", alt: "Collage of a forest and a circular pool.", credit: TO_CONFIRM },
          { name: "idea/neuro-architecture", alt: "Collage of a city map with marked points.", credit: TO_CONFIRM },
          { name: "idea/neuro-legibility", alt: "Collage of a courtyard house.", credit: TO_CONFIRM },
          { name: "idea/neuro-environment", alt: "Collage of a brain beneath a concrete building.", credit: TO_CONFIRM },
        ],
        // PSD: title, then text, for each tile.
        text: [
          "Stress & Cognitive Load",
          "Calm spaces reduce stress and support focus and clarity.",
          "Sensory Balance",
          "Balanced sensory elements foster comfort and emotional regulation",
          "Nature & Attention Restoration",
          "Nature restores attention, reduces stress and encourages slower experiences.",
          "Neuroarchitecture",
          "Architecture shapes behaviour, emotion and well-being.",
          "Spatial Legibility & Belonging",
          "Clear layouts strengthen orientation, memory and belonging.",
          "Environmental Responsiveness",
          "Climate-responsive design supports comfort and sustainable living.",
        ],
      },
      {
        id: "case-studies",
        title: "CASE STUDIES",
        pages: [24],
        images: [
          { name: "idea/case-brion", alt: "Concrete walls, water and planting at Brion Cemetery.", credit: "Carlo Scarpa. Photographer to confirm" },
          { name: "idea/case-brick", alt: "A brick stair, a timber bench and a braided door handle.", credit: TO_CONFIRM },
        ],
        // PSD
        text: [
          "Movement through Brion Cemetery is slow and non-linear, revealing spaces gradually and encouraging discovery.",
          "Concrete, stone, water and vegetation embrace weathering and ageing, allowing architecture to reflect the passage of time.",
          "Alternating enclosure and openness guide visitors through a reflective journey of mourning.",
          "Thresholds, level changes and framed openings mark transitions, slowing movement and heightening awareness of each crossing.",
          "The braided leather handle creates a tactile memory while preventing the metal from feeling cold in winter.",
          "A gradual ascent through brick-lined stairways and shifting clerestory light slows movement and prepares occupants for collective decision-making.",
          "The seat has inbuild heaters so that users feel comfortable",
        ],
      },
      {
        id: "application",
        title: "APPLICATION",
        pages: [24],
        images: [
          { name: "idea/render-library", alt: "Render of a dark library hall opening through a narrow slit." },
          { name: "idea/render-water", alt: "Render of a figure seated at a reflecting pool facing the sea." },
          { name: "idea/render-hall", alt: "Render of a community hall on stilts above a stone landscape." },
          { name: "idea/render-residential", alt: "Render of a woman on a sheltered balcony." },
          { name: "idea/render-housing", alt: "Painted elevation of a timber house." },
        ],
        // PSD: title, then text, for each building.
        text: [
          "Library Building",
          "A narrow slit compresses perception before opening onto a sheltered verandah and reflecting pool that extends the horizon. The low ceiling offers refuge within the vast landscape, creating pause through anticipation, wonder and framed views.",
          "Community hall",
          "The community hall’s elevated auditorium establishes monumentality, while stone landscapes and tactile surfaces bring the ground to a human scale, transforming awe into familiarity through touch and movement.",
          "Residential Building",
          "Sheltered balconies frame views of the landscape and community, offering refuge for pause and observation, while cluster orientation connects homes to the surrounding landscape and shared courtyard, encouraging interaction and strengthening belonging.",
          "Incremental Housing",
          "Residential units are conceived as incremental frameworks capable of growth, contraction and modification over time. Rather than prescribing a fixed mode of living, the design acknowledges that homes must evolve alongside the changing needs of their inhabitants.",
        ],
      },
      {
        id: "back-to-the-island",
        pages: [11],
        images: [
          { name: "idea/arch-collage", alt: "Arched collage of a whale, a turtle, a tree held by hands, and a hut." },
          { name: "idea/terrain", alt: "Isometric diagram of the site's terrain." },
          { name: "idea/slope-ratio", alt: "Isometric diagram of the site's slopes." },
          { name: "idea/accessibility", alt: "Isometric diagram of the site's access." },
        ],
      },
      {
        id: "strategies",
        title: "STRATEGIES",
        pages: [12],
        images: [
          { name: "idea/strategy-canopy", alt: "Watercolour of a settlement under a tree canopy." },
          { name: "idea/strategy-tower", alt: "Watercolour of an evacuation tower among trees." },
          { name: "idea/strategy-steps", alt: "Sketch of people on a shared stepped street." },
          { name: "idea/strategy-locator", alt: "Small locator map of Great Nicobar." },
          { name: "idea/strategy-buffer", alt: "Watercolour of a forest edge." },
          { name: "idea/strategy-exchange", alt: "Sketch of residents sharing knowledge." },
          { name: "idea/strategy-terrain", alt: "Watercolour of a building set into a slope." },
          { name: "idea/strategy-market", alt: "Watercolour of a covered market." },
          { name: "idea/strategy-wetland", alt: "Watercolour section of wetland and rainforest." },
          { name: "idea/strategy-water", alt: "Watercolour section of a rainwater pond." },
          { name: "idea/strategy-climate", alt: "Watercolour of a raised house with a butterfly roof." },
          { name: "idea/strategy-boat", alt: "Painting of a sailing boat." },
        ],
      },
    ],
  },
  {
    id: "act-3",
    number: "03",
    navLabel: "THE GROUND",
    question: "Where exactly?",
    pages: [9, 10],
    sections: [
      {
        id: "land-analysis",
        pages: [9],
        images: [
          { name: "ground/tribal-map", alt: "Map of tribal areas, forest and national parks on Great Nicobar.", credit: "Dr M Chandi, ANTRI RAC, with A&N Forest Dept GIS cell, 2018" },
          { name: "ground/project-land-map", alt: "Map of the land within the project area.", credit: "NITI Aayog, Holistic Development of Great Nicobar Island" },
          { name: "ground/land-use-map", alt: "Map of proposed land use.", credit: TO_CONFIRM },
        ],
      },
      {
        id: "settlements",
        pages: [9],
        images: [{ name: "ground/settlements-strip", alt: "Hand-coloured strip of the coast with its settlements circled." }],
      },
      { id: "site", title: "Site plan", pages: [10], images: [] },
      {
        id: "contours",
        pages: [10],
        images: [{ name: "ground/contour-plan", alt: "Site plan with contours, water catchments and the coast." }],
      },
      {
        id: "context",
        title: "Site context",
        pages: [10],
        images: [
          { name: "ground/infrastructure-strip", alt: "Photographs of buildings and streets near the site.", credit: "Photographer to confirm" },
          { name: "ground/site-section", alt: "Long section from the interior forest to the coast." },
          { name: "ground/site-context", alt: "Map of the site's surroundings with a satellite inset.", credit: "Satellite imagery provider to confirm" },
          { name: "ground/site-photos", alt: "Aerial photographs of forest, mangrove and beach.", credit: "Photographer to confirm" },
        ],
      },
    ],
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
