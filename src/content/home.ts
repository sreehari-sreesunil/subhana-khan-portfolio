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
  /**
   * Scroll scene: where the figure ends up, in cell units (x by cell width, y by cell height),
   * plus an optional lean in degrees around its feet.
   */
  move: { x: number; y: number; rotate?: number };
  /** Keep the figure inside its anchor tile while it moves. */
  clip?: boolean;
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
      move: { x: 0, y: 0, rotate: 5 },
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
      move: { x: 0.6, y: 0 },
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
      move: { x: -0.03, y: -0.074 },
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
      move: { x: -0.126, y: -0.081 },
      clip: true,
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
      move: { x: -0.35, y: 0 },
      clip: true,
    },
  ],
};

export type AboutIntroContent = {
  heading: string;
  /** Short home version of her page 01. */
  paragraphs: string[];
  link: { label: string; href: string };
  portrait: ImageAsset;
  portraitAlt: string;
};

export const about: AboutIntroContent = {
  heading: "Hello! I’m Subhana",
  paragraphs: [
    "Right now, architecture for me is about learning and discovering what kind of architect I want to become. I don't think I've found my architecture yet, and I think that's part of the process.",
    "The idea of form follows care has become an important lens through which I approach design, and it continues to shape the work in this portfolio.",
  ],
  link: { label: "More about me", href: "/about" },
  // TEMP: cut out of the flattened PDF page; replace with her original portrait.
  portrait: { src: "/images/home/about/portrait-temp.png", width: 376, height: 621 },
  portraitAlt: "Subhana Khan",
};
