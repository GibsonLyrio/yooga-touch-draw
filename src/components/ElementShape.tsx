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
    case "room":
      return (
        <g>
          <rect
            x={-w / 2}
            y={-h / 2}
            width={w}
            height={h}
            rx={6}
            fill="#f8fafc"
            stroke="#98a2b3"
            strokeWidth={5}
            strokeDasharray="12 6"
          />
          <text x={-w / 2 + 18} y={-h / 2 + 30} fill="#667085" fontSize={18} fontWeight={600}>
            CÔMODO
          </text>
        </g>
      );
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
    case "printer":
      return (
        <g {...style}>
          <rect x={-w / 2} y={-h * 0.25} width={w} height={h * 0.62} rx={8} fill="#e2eaf3" />
          <rect x={-w * 0.32} y={-h / 2} width={w * 0.64} height={h * 0.38} rx={3} fill="#fff" />
          <rect x={-w * 0.3} y={h * 0.12} width={w * 0.6} height={h * 0.32} rx={2} fill="#fff" />
          <circle cx={w * 0.32} cy={-h * 0.05} r={3} fill="#12b76a" stroke="none" />
        </g>
      );
    case "computer":
      return (
        <g {...style}>
          <rect x={-w / 2} y={-h / 2} width={w} height={h * 0.7} rx={6} fill="#dbeafe" />
          <path d={`M 0 ${h * 0.2} V ${h * 0.42} M ${-w * 0.22} ${h * 0.42} H ${w * 0.22}`} fill="none" />
        </g>
      );
    case "checkout":
      return (
        <g {...style}>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill="#fef0c7" />
          <rect x={-w * 0.32} y={-h * 0.32} width={w * 0.64} height={h * 0.28} rx={3} fill="#fff" />
          <path d={`M ${-w * 0.28} ${h * 0.15} H ${w * 0.28} M ${-w * 0.2} ${h * 0.32} H ${w * 0.2}`} fill="none" />
        </g>
      );
    case "kitchen":
      return (
        <g {...style}>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill="#e8f5e9" />
          {[-0.27, 0.27].map((x) => [-0.22, 0.22].map((y) => (
            <circle key={`${x}-${y}`} cx={w * x} cy={h * y} r={Math.min(w, h) * 0.13} fill="#fff" />
          )))}
        </g>
      );
    case "bar":
      return (
        <g {...style}>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill="#fce7d6" />
          <path d={`M ${-w * 0.36} 0 H ${w * 0.36}`} fill="none" />
          <circle cx={-w * 0.3} cy={0} r={5} fill="#fff" />
          <circle cx={w * 0.3} cy={0} r={5} fill="#fff" />
        </g>
      );
    case "stock":
      return (
        <g {...style}>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill="#f2f4f7" />
          <path d={`M ${-w / 2} ${-h * 0.16} H ${w / 2} M ${-w / 2} ${h * 0.18} H ${w / 2} M 0 ${-h / 2} V ${h / 2}`} fill="none" />
        </g>
      );
    case "fridge":
      return (
        <g {...style}>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill="#e0f2fe" />
          <path d={`M ${-w / 2} ${-h * 0.08} H ${w / 2} M ${w * 0.26} ${-h * 0.35} V ${-h * 0.16} M ${w * 0.26} ${h * 0.05} V ${h * 0.22}`} fill="none" />
        </g>
      );
  }
}
