import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";
import { ELEMENTS, orderElementsForDisplay, SCENE_HEIGHT, SCENE_WIDTH } from "../editor/elements";
import { clientToScene, moveElement, resizeElementFromCorner, selectElementsInArea, selectionArea } from "../editor/interactions";
import type { DrawingElement, Point, SelectionArea } from "../editor/types";
import { ElementShape } from "./ElementShape";
import { Icon } from "./Icon";

interface Props {
  elements: DrawingElement[];
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
  onChange: (element: DrawingElement) => void;
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
  svgRef: RefObject<SVGSVGElement | null>;
}

export function DrawingCanvas({
  elements,
  selectedIds,
  onSelect,
  onChange,
  onInteractionStart,
  onInteractionEnd,
  svgRef,
}: Props) {
  const drag = useRef<{
    pointerId: number;
    element: DrawingElement;
    offset?: Point;
    mode: "move" | "resize";
  } | null>(null);
  const marquee = useRef<{ pointerId: number; start: Point } | null>(null);
  const [marqueeArea, setMarqueeArea] = useState<SelectionArea | null>(null);
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
    onSelect([element.id]);
    if (element.locked) return;
    const svg = svgRef.current;
    if (!svg) return;
    const point = clientToScene(svg, event.clientX, event.clientY);
    if (!point) return;
    event.preventDefault();
    onInteractionStart();
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
    onSelect([element.id]);
    onInteractionStart();
    svg.setPointerCapture(event.pointerId);
    drag.current = { pointerId: event.pointerId, element, mode: "resize" };
  }

  function handleMove(event: PointerEvent<SVGSVGElement>) {
    const activeMarquee = marquee.current;
    if (activeMarquee?.pointerId === event.pointerId) {
      const point = clientToScene(event.currentTarget, event.clientX, event.clientY);
      if (!point) return;
      const area = selectionArea(activeMarquee.start, point);
      setMarqueeArea(area);
      onSelect(selectElementsInArea(elements, area));
      return;
    }
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
    if (marquee.current?.pointerId === event.pointerId) {
      marquee.current = null;
      setMarqueeArea(null);
      if (event.currentTarget.hasPointerCapture(event.pointerId))
        event.currentTarget.releasePointerCapture(event.pointerId);
      return;
    }
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    onInteractionEnd();
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
          if (!event.isPrimary || event.button !== 0 || drag.current || marquee.current) return;
          const point = clientToScene(event.currentTarget, event.clientX, event.clientY);
          if (!point) return;
          event.preventDefault();
          onSelect([]);
          marquee.current = { pointerId: event.pointerId, start: point };
          setMarqueeArea(selectionArea(point, point));
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={handleMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={() => {
          if (drag.current) onInteractionEnd();
          drag.current = null;
          marquee.current = null;
          setMarqueeArea(null);
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
            aria-label={
              element.type === "room"
                ? element.roomName?.trim() || ELEMENTS[element.type].label
                : ELEMENTS[element.type].label
            }
            aria-pressed={selectedIds.includes(element.id)}
            aria-describedby="canvas-keyboard-help"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect([element.id]);
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
                onSelect([element.id]);
                onChange(
                  moveElement(element, {
                    x: element.x + delta.x,
                    y: element.y + delta.y,
                  }),
                );
              }
              if (event.key === "Escape") {
                event.preventDefault();
                onSelect([]);
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
          .filter((element) => selectedIds.includes(element.id))
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
              {selectedIds.length === 1 && !element.locked && (
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
        {marqueeArea && (
          <rect
            data-editor-only="true"
            className="selection-marquee"
            pointerEvents="none"
            x={marqueeArea.x}
            y={marqueeArea.y}
            width={marqueeArea.width}
            height={marqueeArea.height}
            vectorEffect="non-scaling-stroke"
          />
        )}
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
