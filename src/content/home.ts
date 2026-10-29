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

export type FigureVariant = "leaning" | "walking" | "yellow-dress" | "elderly-couple" | "children";

export type HeroFigure = {
  id: string;
  variant: FigureVariant;
  alt: string;
  image: ImageAsset | null;
  anchorTileId: string;
  /** Percentages of the anchor tile; negative values hang past its edge. */
  left: number;
  bottom: number;
  /** Figure height in rows (1 = one cell tall); width follows the figure's own proportions. */
  height: number;
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
    { id: "01", col: 1, row: 1, colSpan: 1, rowSpan: 2, image: { src: "/images/home/tiles/tile-01.jpg", width: 421, height: 993 }, alt: "", placeholderTone: "sage" },
    { id: "02", col: 2, row: 1, colSpan: 1, rowSpan: 1, image: { src: "/images/home/tiles/tile-02.jpg", width: 420, height: 436 }, alt: "", placeholderTone: "sand" },
    { id: "03", col: 3, row: 1, colSpan: 1, rowSpan: 1, image: { src: "/images/home/tiles/tile-03.jpg", width: 423, height: 436 }, alt: "", placeholderTone: "teal" },
    { id: "04", col: 4, row: 1, colSpan: 1, rowSpan: 1, image: { src: "/images/home/tiles/tile-04.jpg", width: 424, height: 436 }, alt: "", placeholderTone: "paper" },
    { id: "05", col: 2, row: 2, colSpan: 1, rowSpan: 1, image: { src: "/images/home/tiles/tile-05.jpg", width: 420, height: 437 }, alt: "", placeholderTone: "paper" },
    { id: "06", col: 3, row: 2, colSpan: 2, rowSpan: 1, image: { src: "/images/home/tiles/tile-06.jpg", width: 948, height: 437 }, alt: "", placeholderTone: "sand" },
    { id: "07", col: 1, row: 3, colSpan: 1, rowSpan: 1, image: { src: "/images/home/tiles/tile-07.jpg", width: 421, height: 438 }, alt: "", placeholderTone: "sand" },
    { id: "08", col: 2, row: 3, colSpan: 1, rowSpan: 1, image: { src: "/images/home/tiles/tile-08.jpg", width: 420, height: 438 }, alt: "", placeholderTone: "teal" },
    { id: "09", col: 3, row: 3, colSpan: 1, rowSpan: 1, image: { src: "/images/home/tiles/tile-09.jpg", width: 423, height: 438 }, alt: "", placeholderTone: "sage" },
    { id: "10", col: 4, row: 3, colSpan: 1, rowSpan: 1, image: { src: "/images/home/tiles/tile-10.jpg", width: 424, height: 438 }, alt: "", placeholderTone: "sand" },
    { id: "11", col: 1, row: 4, colSpan: 2, rowSpan: 1, image: { src: "/images/home/tiles/tile-11.jpg", width: 962, height: 436 }, alt: "", placeholderTone: "paper" },
    { id: "12", col: 3, row: 4, colSpan: 1, rowSpan: 1, image: { src: "/images/home/tiles/tile-12.jpg", width: 423, height: 436 }, alt: "", placeholderTone: "sage" },
    { id: "13", col: 4, row: 4, colSpan: 1, rowSpan: 1, image: { src: "/images/home/tiles/tile-13.jpg", width: 424, height: 436 }, alt: "", placeholderTone: "teal" },
  ],
  // Positions measured from her cover.psd, relative to each anchor tile.
  figures: [
    {
      id: "leaning-woman",
      variant: "leaning",
      alt: "",
      image: { src: "/images/home/figures/leaning-woman.png", width: 171, height: 391 },
      anchorTileId: "03",
      left: -0.9,
      bottom: -28.4,
      height: 0.895,
      speed: 0.3,
    },
    {
      id: "walking-woman",
      variant: "walking",
      alt: "",
      image: { src: "/images/home/figures/walking-woman.png", width: 248, height: 421 },
      anchorTileId: "05",
      left: -31,
      bottom: -3,
      height: 0.964,
      speed: 0.5,
    },
    {
      id: "yellow-dress-woman",
      variant: "yellow-dress",
      alt: "",
      image: { src: "/images/home/figures/yellow-dress-woman.png", width: 123, height: 324 },
      anchorTileId: "11",
      left: 84.7,
      bottom: -22.9,
      height: 0.742,
      speed: 0.4,
    },
    {
      id: "elderly-couple",
      variant: "elderly-couple",
      alt: "",
      image: { src: "/images/home/figures/elderly-couple.png", width: 140, height: 213 },
      anchorTileId: "02",
      left: 48.3,
      bottom: 22.2,
      height: 0.488,
      speed: 0.2,
    },
    {
      id: "children",
      variant: "children",
      alt: "",
      image: { src: "/images/home/figures/children.png", width: 235, height: 315 },
      anchorTileId: "13",
      left: 46.2,
      bottom: 0.5,
      height: 0.721,
      speed: 0.25,
    },
  ],
};
