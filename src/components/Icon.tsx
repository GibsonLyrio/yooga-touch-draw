import type { CSSProperties } from "react";

const paths = {
  plus: "M12 5v14M5 12h14",
  download: "M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4",
  trash: "M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7",
  rotate: "M4 9a8 8 0 1 1 0 6M4 3v6h6",
  help: "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4m.1 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  close: "m6 6 12 12M6 18 18 6",
  layout: "M3 3h18v18H3zM8 3v18M8 9h13",
  pointer: "m5 3 14 9-7 1-3 7z",
  check: "m5 12 4 4L19 6",
  info: "M12 11v6m0-10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  warning: "m12 3 10 18H2zM12 9v5m0 3h.01",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  lock: "M6 10V7a6 6 0 0 1 12 0v3M5 10h14v11H5z",
  unlock: "M8 10V7a5 5 0 0 1 9-3M5 10h14v11H5z",
  undo: "M9 7 4 12l5 5M5 12h8a6 6 0 0 1 6 6",
  redo: "m15 7 5 5-5 5m4-5h-8a6 6 0 0 0-6 6",
  copy: "M8 8h11v11H8zM5 16H4V4h12v1",
} as const;

export function Icon({
  name,
  size = 20,
  style,
}: {
  name: keyof typeof paths;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={style}
    >
      <path d={paths[name]} />
    </svg>
  );
}
