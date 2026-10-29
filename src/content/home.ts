export type ImageAsset = {
  src: string;
  width: number;
  height: number;
};

export type PlaceholderTone = "sand" | "sage" | "paper" | "teal";

export type HeroTile = {
  id: string;
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  image: ImageAsset | null;
  alt: string;
  placeholderTone: PlaceholderTone;
};

export type FigureVariant = "leaning" | "walking" | "yellow-dress";

export type HeroFigure = {
  id: string;
  variant: FigureVariant;
  alt: string;
  image: ImageAsset | null;
  anchorTileId: string;
  /** Percentages of the anchor tile; negative values hang past its edge. */
  left: number;
  bottom: number;
  width: number;
  /** Parallax drift: the figure rises speed × 100px across the Hero. */
  speed: number;
};

export type HeroContent = {
  name: string;
  portfolioLabel: string;
  worksLabel: string;
  tiles: HeroTile[];
  figures: HeroFigure[];
};

export const hero: HeroContent = {
  name: "SUBHANA KHAN",
  portfolioLabel: "Portfolio",
  worksLabel: "Selected Works - 2021-26",
  tiles: [
    { id: "01", col: 1, row: 1, colSpan: 1, rowSpan: 2, image: null, alt: "", placeholderTone: "sage" },
    { id: "02", col: 2, row: 1, colSpan: 1, rowSpan: 1, image: null, alt: "", placeholderTone: "sand" },
    { id: "03", col: 3, row: 1, colSpan: 1, rowSpan: 1, image: null, alt: "", placeholderTone: "teal" },
    { id: "04", col: 4, row: 1, colSpan: 1, rowSpan: 1, image: null, alt: "", placeholderTone: "paper" },
    { id: "05", col: 2, row: 2, colSpan: 1, rowSpan: 1, image: null, alt: "", placeholderTone: "paper" },
    { id: "06", col: 3, row: 2, colSpan: 2, rowSpan: 1, image: null, alt: "", placeholderTone: "sand" },
    { id: "07", col: 1, row: 3, colSpan: 1, rowSpan: 1, image: null, alt: "", placeholderTone: "sand" },
    { id: "08", col: 2, row: 3, colSpan: 1, rowSpan: 1, image: null, alt: "", placeholderTone: "teal" },
    { id: "09", col: 3, row: 3, colSpan: 1, rowSpan: 1, image: null, alt: "", placeholderTone: "sage" },
    { id: "10", col: 4, row: 3, colSpan: 1, rowSpan: 1, image: null, alt: "", placeholderTone: "sand" },
    { id: "11", col: 1, row: 4, colSpan: 2, rowSpan: 1, image: null, alt: "", placeholderTone: "paper" },
    { id: "12", col: 3, row: 4, colSpan: 1, rowSpan: 1, image: null, alt: "", placeholderTone: "sage" },
    { id: "13", col: 4, row: 4, colSpan: 1, rowSpan: 1, image: null, alt: "", placeholderTone: "teal" },
  ],
  figures: [
    {
      id: "leaning-woman",
      variant: "leaning",
      alt: "",
      image: null,
      anchorTileId: "03",
      left: 48,
      bottom: -22,
      width: 34,
      speed: 0.3,
    },
    {
      id: "walking-woman",
      variant: "walking",
      alt: "",
      image: null,
      anchorTileId: "05",
      left: -18,
      bottom: 6,
      width: 34,
      speed: 0.5,
    },
    {
      id: "yellow-dress-woman",
      variant: "yellow-dress",
      alt: "",
      image: null,
      anchorTileId: "11",
      left: 80,
      bottom: -30,
      width: 16,
      speed: 0.4,
    },
  ],
};
