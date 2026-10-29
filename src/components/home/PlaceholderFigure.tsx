import type { FigureVariant } from "@/content/home";

export default function PlaceholderFigure({ variant }: { variant: FigureVariant }) {
  return (
    <svg
      viewBox="0 0 40 100"
      className="block h-full w-auto"
      aria-hidden="true"
    >
      <g fill="var(--ink-green)" fillOpacity={0.85}>
        {variant === "leaning" && (
          <>
            <circle cx="25" cy="9" r="6" />
            <path d="M19 17 Q28 15 30 22 L26 60 L20 60 Z" />
            <path d="M20 58 L16 99 L20 99 L24 60 Z" />
            <path d="M24 58 L27 99 L31 99 L27 58 Z" />
            <path d="M28 22 L37 40 L35 42 L26 28 Z" />
          </>
        )}
        {variant === "walking" && (
          <>
            <circle cx="20" cy="9" r="6" />
            <path d="M14 17 Q20 14 26 17 L27 58 L13 58 Z" />
            <path d="M15 56 L6 99 L10 99 L20 60 Z" />
            <path d="M20 56 L31 99 L35 99 L25 56 Z" />
            <path d="M14 20 L8 44 L11 45 L17 26 Z" />
          </>
        )}
        {variant === "yellow-dress" && (
          <>
            <circle cx="20" cy="9" r="6" />
            <path d="M15 17 Q20 14 25 17 L26 28 L14 28 Z" />
            <path d="M14 26 L26 26 L34 68 L6 68 Z" fill="var(--sun)" fillOpacity={1} />
            <path d="M14 66 L13 99 L17 99 L18 66 Z" />
            <path d="M22 66 L23 99 L27 99 L26 66 Z" />
          </>
        )}
      </g>
    </svg>
  );
}
