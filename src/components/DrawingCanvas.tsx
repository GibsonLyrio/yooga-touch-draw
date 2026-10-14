import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";
import { ELEMENTS, orderElementsForDisplay, SCENE_HEIGHT, SCENE_WIDTH } from "../editor/elements";
import { clientToScene, moveElement, resizeElementFromCorner } from "../editor/interactions";
import type { DrawingElement, Point } from "../editor/types";
import { ElementShape } from "./ElementShape";
import { Icon } from "./Icon";

interface Props {
  elements: DrawingElement[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (element: DrawingElement) => void;
  svgRef: RefObject<SVGSVGElement | null>;
}

export function DrawingCanvas({
  elements,
  selectedId,
  onSelect,
  onChange,
  svgRef,
}: Props) {
  const drag = useRef<{
    pointerId: number;
    element: DrawingElement;
    offset?: Point;
    mode: "move" | "resize";
  } | null>(null);
  const [minimumTarget, setMinimumTarget] = useState(44);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const observer = new ResizeObserver(() => {
      const scale = svg.getScreenCTM()?.a;
      if (scale && scale > 0) setMinimumTarget(44 / scale);
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, [svgRef]);

  function startDrag(
    event: PointerEvent<SVGGElement>,
    element: DrawingElement,
  ) {
    if (!event.isPrimary || event.button !== 0 || drag.current) return;
    event.stopPropagation();
    onSelect(element.id);
    if (element.locked) return;
    const svg = svgRef.current;
    if (!svg) return;
    const point = clientToScene(svg, event.clientX, event.clientY);
    if (!point) return;
    event.preventDefault();
    svg.setPointerCapture(event.pointerId);
    drag.current = {
      pointerId: event.pointerId,
      element,
      offset: { x: point.x - element.x, y: point.y - element.y },
      mode: "move",
    };
  }

  function startResize(event: PointerEvent<SVGCircleElement>, element: DrawingElement) {
    if (!event.isPrimary || event.button !== 0 || drag.current || element.locked) return;
    const svg = svgRef.current;
    if (!svg) return;
    event.stopPropagation();
    event.preventDefault();
    onSelect(element.id);
    svg.setPointerCapture(event.pointerId);
    drag.current = { pointerId: event.pointerId, element, mode: "resize" };
  }

  function handleMove(event: PointerEvent<SVGSVGElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const point = clientToScene(
      event.currentTarget,
      event.clientX,
      event.clientY,
    );
    if (!point) return;
    if (active.mode === "resize") {
      onChange(resizeElementFromCorner(active.element, point));
    } else if (active.offset) {
      onChange(moveElement(active.element, {
        x: point.x - active.offset.x,
        y: point.y - active.offset.y,
      }));
    }
  }

  function endDrag(event: PointerEvent<SVGSVGElement>) {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <div className="canvas-frame">
      <svg
        ref={svgRef}
        className="drawing-canvas"
        viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`}
        role="group"
        tabIndex={-1}
        aria-label="Área de desenho do restaurante"
        aria-describedby="canvas-keyboard-help"
        onPointerDown={(event) => {
          if (event.isPrimary && !drag.current) onSelect(null);
        }}
        onPointerMove={handleMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={() => {
          drag.current = null;
        }}
      >
        <rect width={SCENE_WIDTH} height={SCENE_HEIGHT} fill="#ffffff" />
        <defs data-editor-only="true">
          <pattern
            id="canvas-dots"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="12" cy="12" r="1" fill="#ced2d3" />
          </pattern>
        </defs>
        <rect
          data-editor-only="true"
          width={SCENE_WIDTH}
          height={SCENE_HEIGHT}
          fill="url(#canvas-dots)"
        />
        {orderElementsForDisplay(elements).map((element) => (
          <g
            key={element.id}
            transform={`translate(${element.x} ${element.y}) rotate(${element.rotation})`}
            onPointerDown={(event) => startDrag(event, element)}
            className={`drawing-element ${element.locked ? "is-locked" : ""}`}
            role="button"
            tabIndex={0}
            aria-label={ELEMENTS[element.type].label}
            aria-pressed={element.id === selectedId}
            aria-describedby="canvas-keyboard-help"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(element.id);
              }
              if (element.locked) return;
              const step = event.shiftKey ? 1 : 10;
              const directions: Record<string, Point> = {
                ArrowLeft: { x: -step, y: 0 },
                ArrowRight: { x: step, y: 0 },
                ArrowUp: { x: 0, y: -step },
                ArrowDown: { x: 0, y: step },
              };
              const delta = directions[event.key];
              if (delta) {
                event.preventDefault();
                onSelect(element.id);
                onChange(
                  moveElement(element, {
                    x: element.x + delta.x,
                    y: element.y + delta.y,
                  }),
                );
              }
              if (event.key === "Escape") {
                event.preventDefault();
                onSelect(null);
              }
            }}
          >
            <ElementShape {...element} />
            <rect
              data-editor-only="true"
              x={-Math.max(element.width + 16, minimumTarget) / 2}
              y={-Math.max(element.height + 16, minimumTarget) / 2}
              width={Math.max(element.width + 16, minimumTarget)}
              height={Math.max(element.height + 16, minimumTarget)}
              fill="transparent"
            />
          </g>
        ))}
        {/* A seleção fica acima da cena, sem interceptar outros objetos. */}
        {elements
          .filter((element) => element.id === selectedId)
          .map((element) => (
            <g
              key={element.id}
              data-editor-only="true"
              transform={`translate(${element.x} ${element.y}) rotate(${element.rotation})`}
            >
              <rect
                pointerEvents="none"
                x={-element.width / 2 - 6}
                y={-element.height / 2 - 6}
                width={element.width + 12}
                height={element.height + 12}
                rx="6"
                fill="none"
                stroke="var(--y-color-border-selected)"
                strokeWidth="2"
                strokeDasharray="6 4"
                vectorEffect="non-scaling-stroke"
              />
              {!element.locked && (
                <circle
                  className="resize-handle"
                  cx={element.width / 2 + 6}
                  cy={element.height / 2 + 6}
                  r={Math.max(8, minimumTarget / 4)}
                  fill="var(--y-color-action-solid)"
                  stroke="#fff"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                  role="button"
                  aria-label={`Redimensionar ${ELEMENTS[element.type].label.toLowerCase()}`}
                  onPointerDown={(event) => startResize(event, element)}
                />
              )}
            </g>
          ))}
      </svg>
      {elements.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">
            <Icon name="layout" size={30} />
          </span>
          <h3>Seu espaço começa aqui</h3>
          <p>Adicione um elemento e arraste para organizar.</p>
        </div>
      )}
    </div>
  );
}
