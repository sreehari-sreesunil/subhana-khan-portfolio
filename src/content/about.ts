import { about as homeAbout, type AboutIntroContent } from "./home";

export type CvEntry = { year: string; text: string };
export type CvSchool = { name: string; note: string };
export type CvSoftware = { abbr: string; label: string };

// Her pages 01 and 02. Text is exact apart from the approved typo fixes in CLAUDE.md;
// words split by a line-end hyphen on her page are rejoined.
export const aboutIntro: AboutIntroContent = {
  heading: "Hello! I‘m Subhana",
  paragraphs: [
    "Right now, architecture for me is about learning and discovering what kind of architect I want to become. I don't think I've found my architecture yet, and I think that's part of the process.",
    "There was a point where I questioned whether architecture was for me. Reading the work of Alvar Aalto, Neelkanth Chhaya, Tadao Ando and many others changed the way I approached design. What interested me wasn't their unique style, but the way they understood context, movement, material and the everyday occupation of space. That shifted my focus from following a process to designing experiences.",
    "I'm particularly interested in how spatial decisions influence behaviour and occupation. I like observing how thresholds, proportions, light, edges and transitions shape the way people move through a place. But what fascinates me even more is that architecture is never complete once it's built. People reclaim spaces, assign new meanings to them and occupy them in ways the architect could never fully anticipate. I think that's where architecture becomes most interesting.",
    "At this stage, I'm less interested in developing a signature style and more interested in developing a way of thinking. I hope my work continues to become more attentive to the people it is designed for and more conscious in the way it responds to place. The idea of form follows care has become an important lens through which I approach design, and it continues to shape the work in this portfolio",
  ],
  portrait: homeAbout.portrait,
  portraitAlt: homeAbout.portraitAlt,
};

export const cv = {
  title: "CV",
  name: "Subhana Khan",
  headings: {
    contact: "CONTACT",
    education: "EDUCATION",
    competition: "COMPETITION",
    software: "SOFTWARE SKILLS",
    experience: "EXPERIENCE",
    workshops: "WORKSHOPS",
    skills: "SKILLS",
    languages: "LANGUAGES",
  },
  education: [
    { name: "Indian school, Al ain", note: "Primary" },
    { name: "TocH public school", note: "Higher secondary" },
    { name: "Asian school of architecture and design innovation", note: "Mahatma gandhi university" },
  ] satisfies CvSchool[],
  competition: [
    { year: "2024", text: "Mohammad Shaheer Landscape Trophy (participation)" },
    { year: "2023", text: "ANDC" },
    { year: "2023", text: "YOUniversal photo competition (NASA)" },
    { year: "2023", text: "MAF documentary" },
    {
      year: "2022",
      text: "won the Zonal level of COA Students Awards for Excellence in Documentation of Architectural Heritag",
    },
  ] satisfies CvEntry[],
  // Abbreviations stand in for the product marks on her page; no brand logos.
  software: [
    { abbr: "R", label: "Revit" },
    { abbr: "A", label: "Autocad" },
    { abbr: "D5", label: "D5" },
    { abbr: "MS", label: "MS Office" },
    { abbr: "Ag", label: "Archgis" },
    { abbr: "Ps", label: "Photoshop" },
    { abbr: "Lr", label: "Ligthroom" },
    { abbr: "Id", label: "Indesign" },
    { abbr: "Dv", label: "Da vinci resolve" },
    { abbr: "Su", label: "Sketchup" },
  ] satisfies CvSoftware[],
  experience: [
    { year: "2026", text: "Employed at Maatam as content creator" },
    { year: "2025", text: "Freelance photographer and videographer" },
    { year: "2025", text: "Internship at [Ar & De]" },
    { year: "2024", text: "Colabration with studio acis" },
    { year: "2024", text: "Architecture photography for mudbrick architects, studio vista" },
    { year: "2023", text: "Achara Village Heritage Documentation Project" },
    { year: "2023", text: "Worked with IIA alongside the cochin municpality for a zero waste vision for the city" },
    { year: "2022", text: "Member of student Union counil" },
    { year: "2022", text: "Maatam first edition core team" },
    { year: "2021-24", text: "IIA events volunteer" },
  ] satisfies CvEntry[],
  workshops: [
    "Carpentary workshop",
    "Arch Gis workshop",
    "Rammed earth workshop",
    "Theatre workshop",
    "Origami workshop",
    "Logo desiging workshop",
  ],
  skills: ["Photography", "Editing", "Coordinating", "Journalism", "Reading"],
  languages: ["English", "Malayalam", "Hindi", "Arabic", "Tamil"],
  backLink: { label: "Back to home", href: "/" },
};
