import { ELEMENTS, SCENE_HEIGHT, SCENE_WIDTH } from "./elements";
import type { DrawingElement, Point } from "./types";

export function rotatedBounds(element: DrawingElement): {
  width: number;
  height: number;
} {
  const radians = (element.rotation * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  return {
    width: element.width * cos + element.height * sin,
    height: element.width * sin + element.height * cos,
  };
}

export function moveElement(
  element: DrawingElement,
  position: Point,
): DrawingElement {
  const bounds = rotatedBounds(element);
  const margin = 4; // Preserva o contorno na exportação.
  return {
    ...element,
    x: Math.min(
      SCENE_WIDTH - bounds.width / 2 - margin,
      Math.max(bounds.width / 2 + margin, position.x),
    ),
    y: Math.min(
      SCENE_HEIGHT - bounds.height / 2 - margin,
      Math.max(bounds.height / 2 + margin, position.y),
    ),
  };
}

export function rotateElement(element: DrawingElement): DrawingElement {
  const rotated = { ...element, rotation: (element.rotation + 45) % 360 };
  return moveElement(rotated, rotated);
}

export function resizeElement(
  element: DrawingElement,
  scale: number,
): DrawingElement {
  const base = ELEMENTS[element.type];
  const safeScale = Math.min(2, Math.max(0.5, scale));
  const resized = {
    ...element,
    width: base.width * safeScale,
    height: base.height * safeScale,
  };
  return moveElement(resized, resized);
}

/** A matriz do SVG considera escala, margens de letterbox e posição na página. */
export function clientToScene(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
): Point | null {
  const matrix = svg.getScreenCTM();
  if (!matrix) return null;
  return new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse());
}
