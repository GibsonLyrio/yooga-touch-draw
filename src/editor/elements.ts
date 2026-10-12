import type { DrawingElement, ElementType } from "./types";

export const SCENE_WIDTH = 1200;
export const SCENE_HEIGHT = 800;

function createElementId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // getRandomValues também funciona em HTTP na rede local.
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export const ELEMENTS: Record<
  ElementType,
  { label: string; width: number; height: number }
> = {
  "round-table": { label: "Mesa redonda", width: 100, height: 100 },
  "rect-table": { label: "Mesa retangular", width: 160, height: 90 },
  chair: { label: "Cadeira", width: 56, height: 60 },
  wall: { label: "Parede", width: 240, height: 24 },
};

export function createElement(
  type: ElementType,
  scene: DrawingElement[],
): DrawingElement {
  const { width, height } = ELEMENTS[type];
  // Procura um ponto próximo do centro; sobreposição é permitida em cenas cheias.
  let x = SCENE_WIDTH / 2;
  let y = SCENE_HEIGHT / 2;
  for (let attempt = 0; attempt < 12; attempt++) {
    x = SCENE_WIDTH / 2 + attempt * 20;
    y = SCENE_HEIGHT / 2 + attempt * 20;
    if (!scene.some((element) => Math.hypot(element.x - x, element.y - y) < 24))
      break;
  }
  return { id: createElementId(), type, x, y, width, height, rotation: 0 };
}
