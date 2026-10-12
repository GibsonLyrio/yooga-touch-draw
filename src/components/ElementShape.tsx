import type { DrawingElement } from "../editor/types";

type Props = Pick<DrawingElement, "type" | "width" | "height">;

/** A mesma geometria e as mesmas cores são usadas na biblioteca, cena e PNG. */
export function ElementShape({ type, width: w, height: h }: Props) {
  const style = {
    stroke: "#475467",
    strokeWidth: 2.5,
    strokeLinejoin: "round" as const,
  };
  switch (type) {
    case "round-table":
      return (
        <ellipse
          cx={0}
          cy={0}
          rx={w / 2}
          ry={h / 2}
          fill="#f7e8d3"
          {...style}
        />
      );
    case "rect-table":
      return (
        <rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          rx={10}
          fill="#f7e8d3"
          {...style}
        />
      );
    case "chair":
      return (
        <g {...style}>
          <rect
            x={-w / 2}
            y={-h / 2}
            width={w}
            height={h}
            rx={8}
            fill="#e2eaf3"
          />
          <path
            d={`M ${-w / 2 + 5} ${-h / 2 + h * 0.28} H ${w / 2 - 5}`}
            fill="none"
          />
        </g>
      );
    case "wall":
      return (
        <rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          rx={3}
          fill="#8793a4"
          {...style}
        />
      );
  }
}
