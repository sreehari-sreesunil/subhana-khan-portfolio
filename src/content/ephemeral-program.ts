// Her "Design program" bubble diagram (p.13), redrawn. `wide` is traced from her page, in its pixels; `tall` is
// the same diagram rearranged for phones. Colours are sampled from p.13, bubble by bubble.

export type ProgramGroup = "institution" | "retail" | "residential" | "common" | "water" | "tourist" | "landscape";
type Spot = { x: number; y: number; r: number; lines: string[] };
export type ProgramLayout = "wide" | "tall";

export type ProgramBubble = {
  id: string;
  name: string;
  group: ProgramGroup;
  /** How far her wash of colour sits off the ink circles, as fractions of the radius. */
  wash: [number, number];
  wide: Spot;
  tall: Spot;
};

export type ProgramArrow = { from: string; to: string; wide: string; tall: string };

export const programView = { wide: { x: 50, y: 735, width: 1650, height: 465 }, tall: { x: 0, y: 0, width: 360, height: 850 } };

export const programColours: Record<ProgramGroup, string> = {
  institution: "#EBF0F3",
  retail: "#A6A8BF",
  residential: "#EDEDAF",
  common: "#99CBC2",
  water: "#B4C1C7",
  tourist: "#E7B5AE",
  landscape: "#EDEECE",
};

/** The order the groups appear in: left to right across her diagram. */
export const programOrder: ProgramGroup[] = ["institution", "retail", "residential", "common", "water", "tourist", "landscape"];

const bubble = (id: string, name: string, group: ProgramGroup, wash: [number, number], wide: Spot, tall: Spot): ProgramBubble => ({ id, name, group, wash, wide, tall });

export const programBubbles: ProgramBubble[] = [
  bubble("institution", "Institution Zone", "institution", [0, 0], { x: 145, y: 1000, r: 85, lines: ["Institution Zone"] }, { x: 70, y: 60, r: 52, lines: ["Institution", "Zone"] }),
  bubble("supporting", "Supporting services", "retail", [0.08, 0.06], { x: 342, y: 880, r: 65, lines: ["Supporting", "services"] }, { x: 205, y: 62, r: 46, lines: ["Supporting", "services"] }),
  bubble("shared", "Shared Apartments", "residential", [-0.02, 0.05], { x: 557, y: 855, r: 85, lines: ["Shared", "Apartments"] }, { x: 180, y: 175, r: 52, lines: ["Shared", "Apartments"] }),
  bubble("residential", "Residential units", "residential", [0.03, -0.02], { x: 395, y: 1080, r: 85, lines: ["Residential", "units"] }, { x: 62, y: 240, r: 50, lines: ["Residential", "units"] }),
  bubble("dormitory", "Tourist dormitory", "residential", [0.03, 0.05], { x: 610, y: 1115, r: 72, lines: ["Tourist", "dormitory"] }, { x: 300, y: 235, r: 46, lines: ["Tourist", "dormitory"] }),
  bubble("kitchen", "Community Kitchen", "common", [-0.03, 0.05], { x: 778, y: 850, r: 72, lines: ["Community", "Kitchen"] }, { x: 125, y: 360, r: 52, lines: ["Community", "Kitchen"] }),
  bubble("cafe", "Cafe", "common", [0, 0], { x: 877, y: 825, r: 42, lines: ["Cafe"] }, { x: 180, y: 392, r: 26, lines: ["Cafe"] }),
  bubble("library", "Library", "common", [-0.1, -0.06], { x: 1170, y: 828, r: 85, lines: ["Library"] }, { x: 95, y: 490, r: 50, lines: ["Library"] }),
  bubble("hall", "Community Hall", "common", [-0.05, -0.02], { x: 848, y: 1012, r: 85, lines: ["Community Hall"] }, { x: 265, y: 375, r: 52, lines: ["Community", "Hall"] }),
  bubble("basin", "The basin", "water", [-0.12, 0.1], { x: 1040, y: 875, r: 85, lines: ["The basin"] }, { x: 185, y: 482, r: 52, lines: ["The basin"] }),
  bubble("stay", "Tourist Stay", "tourist", [0.06, 0.04], { x: 1360, y: 815, r: 72, lines: ["Tourist", "Stay"] }, { x: 100, y: 585, r: 46, lines: ["Tourist", "Stay"] }),
  bubble("market", "Sailor’s Market", "tourist", [0.04, 0.03], { x: 1587, y: 808, r: 60, lines: ["Sailor’s", "Market"] }, { x: 44, y: 650, r: 36, lines: ["Sailor’s", "Market"] }),
  bubble("shacks", "Beach Shacks", "tourist", [0.05, 0.05], { x: 1510, y: 880, r: 60, lines: ["Beach", "Shacks"] }, { x: 110, y: 690, r: 42, lines: ["Beach", "Shacks"] }),
  bubble("visitor", "Visitor’s center", "tourist", [-0.04, 0.03], { x: 1137, y: 1082, r: 88, lines: ["Visitor’s center"] }, { x: 265, y: 585, r: 56, lines: ["Visitor’s", "center"] }),
  bubble("canal", "Canal Tourism", "tourist", [-0.04, -0.02], { x: 1315, y: 1020, r: 60, lines: ["Canal", "Tourism"] }, { x: 285, y: 700, r: 44, lines: ["Canal", "Tourism"] }),
  bubble("laxman", "Laxman beach", "landscape", [0, 0], { x: 1605, y: 1020, r: 85, lines: ["Laxman beach"] }, { x: 120, y: 800, r: 46, lines: ["Laxman", "beach"] }),
  bubble("mangroves", "Mangroves", "landscape", [0.1, -0.05], { x: 1482, y: 1135, r: 58, lines: ["Mangroves"] }, { x: 250, y: 800, r: 42, lines: ["Mangroves"] }),
];

/** A label on her page with no bubble and no arrows. */
export const programCourtyard = { name: "Courtyard", wide: { x: 560, y: 990 }, tall: { x: 292, y: 310 } };

const arrow = (from: string, to: string, wide: string, tall: string): ProgramArrow => ({ from, to, wide, tall });

export const programArrows: ProgramArrow[] = [
  arrow("supporting", "institution", "M298 865C240 875 190 895 163 938", "M159 62C147 60 135 60 124 60"),
  arrow("shared", "supporting", "M492 870C455 872 420 880 388 890", "M190 124C191 120 192 116 194 110"),
  arrow("residential", "supporting", "M371 1032C372 990 360 950 342 922", "M82 190C100 150 130 120 162 98"),
  arrow("dormitory", "supporting", "M570 1090C530 1035 455 965 377 912", "M290 191C280 140 268 100 250 78"),
  arrow("shared", "kitchen", "M612 805C660 785 710 790 750 820", "M160 227C150 255 140 285 130 308"),
  arrow("residential", "kitchen", "M465 1060C530 1045 580 1030 625 1008C680 975 720 925 749 882", "M72 289C78 298 85 307 94 318"),
  arrow("dormitory", "kitchen", "M652 1069C690 1025 725 960 752 882", "M264 263C225 285 190 300 162 322"),
  arrow("cafe", "basin", "M905 815C945 810 985 820 1006 842", "M183 418C185 422 186 425 187 430"),
  arrow("shared", "hall", "M603 905C660 930 730 965 785 990", "M205 221C225 255 240 290 252 323"),
  arrow("hall", "basin", "M880 958C915 925 955 905 993 908", "M250 425C240 438 232 445 222 455"),
  arrow("dormitory", "visitor", "M650 1152C720 1180 830 1185 950 1170C1010 1162 1070 1150 1125 1132", "M325 274C350 340 350 470 300 540"),
  arrow("visitor", "stay", "M1125 1015C1180 950 1270 900 1335 862", "M209 585C190 585 170 585 148 585"),
  arrow("visitor", "shacks", "M1165 1012C1220 950 1280 905 1360 885C1400 877 1430 872 1468 873", "M225 625C200 650 175 665 150 678"),
  arrow("visitor", "canal", "M1185 1042C1215 1030 1245 1020 1277 1015", "M275 640C278 645 280 650 282 655"),
  arrow("canal", "mangroves", "M1312 1058C1325 1100 1370 1115 1450 1130", "M275 743C272 748 268 752 264 760"),
  arrow("shacks", "laxman", "M1522 918C1540 945 1555 960 1570 978", "M114 733C116 740 117 745 118 753"),
];
