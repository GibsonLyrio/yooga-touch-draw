import { ELEMENTS, SCENE_HEIGHT, SCENE_WIDTH } from "./elements";
import type { DrawingElement, Point, SelectionArea } from "./types";

export function selectionArea(start: Point, end: Point): SelectionArea {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
}

/** Retorna os objetos cujo contorno visual toca a área de seleção. */
export function selectElementsInArea(
  elements: DrawingElement[],
  area: SelectionArea,
): string[] {
  const right = area.x + area.width;
  const bottom = area.y + area.height;
  return elements
    .filter((element) => {
      const bounds = rotatedBounds(element);
      const left = element.x - bounds.width / 2;
      const elementRight = element.x + bounds.width / 2;
      const top = element.y - bounds.height / 2;
      const elementBottom = element.y + bounds.height / 2;
      return left <= right && elementRight >= area.x && top <= bottom && elementBottom >= area.y;
    })
    .map((element) => element.id);
}

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

export function resizeElementFromCorner(
  element: DrawingElement,
  pointer: Point,
): DrawingElement {
  const radians = (-element.rotation * Math.PI) / 180;
  const dx = pointer.x - element.x;
  const dy = pointer.y - element.y;
  const localPointer = {
    x: dx * Math.cos(radians) - dy * Math.sin(radians),
    y: dx * Math.sin(radians) + dy * Math.cos(radians),
  };
  const opposite = { x: -element.width / 2, y: -element.height / 2 };
  let width = Math.max(40, localPointer.x - opposite.x);
  let height = Math.max(40, localPointer.y - opposite.y);

  if (element.type !== "room") {
    const ratio = element.width / element.height;
    const scale = Math.max(width / element.width, height / element.height);
    width = Math.max(32, element.width * scale);
    height = width / ratio;
    const fitScale = Math.min(1, (SCENE_WIDTH - 8) / width, (SCENE_HEIGHT - 8) / height);
    width *= fitScale;
    height *= fitScale;
  } else {
    width = Math.min(SCENE_WIDTH - 8, Math.max(80, width));
    height = Math.min(SCENE_HEIGHT - 8, Math.max(80, height));
  }

  const localCenter = {
    x: opposite.x + width / 2,
    y: opposite.y + height / 2,
  };
  const forward = (element.rotation * Math.PI) / 180;
  const resized = {
    ...element,
    width,
    height,
    x: element.x + localCenter.x * Math.cos(forward) - localCenter.y * Math.sin(forward),
    y: element.y + localCenter.x * Math.sin(forward) + localCenter.y * Math.cos(forward),
  };
  return moveElement(resized, resized);
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
