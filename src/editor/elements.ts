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

/** Cria uma cópia independente, preservando todas as propriedades editáveis. */
export function duplicateElement(
  source: DrawingElement,
  scene: DrawingElement[],
): DrawingElement {
  let copy = { ...source, id: createElementId() };
  for (let attempt = 1; attempt <= 12; attempt++) {
    const offset = attempt * 24;
    copy = {
      ...copy,
      x: Math.min(SCENE_WIDTH - copy.width / 2, Math.max(copy.width / 2, source.x + offset)),
      y: Math.min(SCENE_HEIGHT - copy.height / 2, Math.max(copy.height / 2, source.y + offset)),
    };
    if (!scene.some((element) => Math.hypot(element.x - copy.x, element.y - copy.y) < 16))
      break;
  }
  return copy;
}

export const ELEMENTS: Record<
  ElementType,
  { label: string; width: number; height: number; category: "space" | "furniture" | "operation" }
> = {
  room: { label: "Cômodo", width: 360, height: 240, category: "space" },
  "round-table": { label: "Mesa redonda", width: 100, height: 100, category: "furniture" },
  "rect-table": { label: "Mesa retangular", width: 160, height: 90, category: "furniture" },
  chair: { label: "Cadeira", width: 56, height: 60, category: "furniture" },
  printer: { label: "Impressora", width: 76, height: 58, category: "operation" },
  computer: { label: "Computador", width: 90, height: 72, category: "operation" },
  checkout: { label: "Caixa", width: 110, height: 72, category: "operation" },
  kitchen: { label: "Cozinha", width: 180, height: 120, category: "operation" },
  bar: { label: "Bar", width: 190, height: 72, category: "operation" },
  stock: { label: "Estoque", width: 150, height: 110, category: "operation" },
  fridge: { label: "Geladeira", width: 72, height: 110, category: "operation" },
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
  return {
    id: createElementId(),
    type,
    x,
    y,
    width,
    height,
    rotation: 0,
    locked: false,
    ...(type === "room" ? { roomName: "Cômodo" } : {}),
  };
}

export function orderElementsForDisplay(elements: DrawingElement[]): DrawingElement[] {
  return [
    ...elements.filter((element) => element.type === "room"),
    ...elements.filter((element) => element.type !== "room"),
  ];
}
