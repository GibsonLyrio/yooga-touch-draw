import { describe, expect, it, vi } from "vitest";
import { createElement, duplicateElement, ELEMENTS, orderElementsForDisplay, SCENE_HEIGHT, SCENE_WIDTH } from "./elements";
import {
  moveElement,
  resizeElement,
  resizeElementFromCorner,
  rotateElement,
  rotatedBounds,
  selectElementsInArea,
  selectionArea,
} from "./interactions";
import type { DrawingElement, ElementType } from "./types";

describe("inserção", () => {
  it("duplica preservando características e criando uma instância independente", () => {
    const source = {
      ...createElement("room", []),
      width: 480,
      height: 310,
      rotation: 0,
      locked: true,
      roomName: "Varanda",
    };
    const copy = duplicateElement(source, [source]);

    expect(copy).toMatchObject({
      type: source.type,
      width: 480,
      height: 310,
      rotation: 0,
      locked: true,
      roomName: "Varanda",
    });
    expect(copy.id).not.toBe(source.id);
    expect(copy.x).not.toBe(source.x);
    expect(copy.y).not.toBe(source.y);
  });

  it("cria elementos distintos sem randomUUID em HTTP na rede local", () => {
    const randomUUID = vi.spyOn(crypto, "randomUUID");
    Object.defineProperty(crypto, "randomUUID", { value: undefined, configurable: true });
    try {
      const first = createElement("chair", []);
      const second = createElement("chair", [first]);
      expect(first.id).toMatch(/^[0-9a-f]{32}$/);
      expect(second.id).not.toBe(first.id);
    } finally {
      randomUUID.mockRestore();
    }
  });

  it.each(Object.keys(ELEMENTS) as ElementType[])(
    "cria %s no centro com dimensões válidas",
    (type) => {
      const element = createElement(type, []);
      expect(element).toMatchObject({
        type,
        x: 600,
        y: 400,
        rotation: 0,
        width: ELEMENTS[type].width,
        height: ELEMENTS[type].height,
      });
      expect(element.id).toBeTruthy();
    },
  );

  it("cria instâncias independentes em posições próximas", () => {
    const first = createElement("chair", []);
    const second = createElement("chair", [first]);
    expect(first.id).not.toBe(second.id);
    expect(second.x).toBeGreaterThan(first.x);
    expect(first.x).toBe(600);
  });

  it("cria cômodo com um nome padrão editável", () => {
    const room = createElement("room", []);
    expect(room.roomName).toBe("Cômodo");
    expect(createElement("chair", []).roomName).toBeUndefined();
  });
});

describe("geometria", () => {
  const table: DrawingElement = {
    id: "mesa",
    type: "rect-table",
    x: 600,
    y: 400,
    width: 160,
    height: 90,
    rotation: 0,
    locked: false,
  };

  it("move sem alterar o objeto original", () => {
    expect(moveElement(table, { x: 250, y: 300 })).toMatchObject({
      x: 250,
      y: 300,
    });
    expect(table.x).toBe(600);
  });

  it("considera largura e altura após rotação", () => {
    const bounds = rotatedBounds({ ...table, rotation: 90 });
    expect(bounds.width).toBeCloseTo(90);
    expect(bounds.height).toBeCloseTo(160);
  });

  it.each([0, 45, 90, 135, 180, 225, 270, 315])(
    "mantém objeto girado %s° dentro da cena ao arrastar para fora",
    (rotation) => {
      const element = { ...table, rotation };
      const { width, height } = rotatedBounds(element);
      for (const coordinate of [-10000, 10000]) {
        const moved = moveElement(element, { x: coordinate, y: coordinate });
        expect(moved.x - width / 2).toBeGreaterThanOrEqual(0);
        expect(moved.y - height / 2).toBeGreaterThanOrEqual(0);
        expect(moved.x + width / 2).toBeLessThanOrEqual(SCENE_WIDTH);
        expect(moved.y + height / 2).toBeLessThanOrEqual(SCENE_HEIGHT);
      }
    },
  );

  it("completa uma volta em oito passos", () => {
    let element = table;
    for (let step = 0; step < 8; step++) element = rotateElement(element);
    expect(element.rotation).toBe(0);
  });

  it("limita tamanho e preserva proporções", () => {
    expect(resizeElement(table, 0)).toMatchObject({ width: 80, height: 45 });
    expect(resizeElement(table, 100)).toMatchObject({
      width: 320,
      height: 180,
    });
    expect(resizeElement(table, 1.5)).toMatchObject({
      width: 240,
      height: 135,
    });
  });

  it("reposiciona ao aumentar e girar perto da borda", () => {
    const element = rotateElement(
      resizeElement({ ...table, x: 1100, y: 750 }, 2),
    );
    const bounds = rotatedBounds(element);
    expect(element.x + bounds.width / 2).toBeLessThanOrEqual(SCENE_WIDTH);
    expect(element.y + bounds.height / 2).toBeLessThanOrEqual(SCENE_HEIGHT);
  });

  it("mantém a proporção de um ícone ao arrastar a alça", () => {
    const resized = resizeElementFromCorner(table, { x: 900, y: 700 });
    expect(resized.width / resized.height).toBeCloseTo(table.width / table.height);
    expect(resized.width).toBeGreaterThan(table.width);
  });

  it("permite alterar livremente a proporção de um cômodo", () => {
    const room = createElement("room", []);
    const resized = resizeElementFromCorner(room, { x: 900, y: 450 });
    expect(resized.width).toBeGreaterThan(room.width);
    expect(resized.height).toBeLessThan(room.height);
    expect(resized.width / resized.height).not.toBeCloseTo(room.width / room.height);
  });

  it("limita qualquer resize às dimensões da cena", () => {
    for (const type of ["room", "computer"] as const) {
      const resized = resizeElementFromCorner(createElement(type, []), { x: 10000, y: 10000 });
      expect(resized.width).toBeLessThanOrEqual(SCENE_WIDTH);
      expect(resized.height).toBeLessThanOrEqual(SCENE_HEIGHT);
    }
  });
});

describe("seleção por área", () => {
  const element = (id: string, x: number, y: number, overrides = {}): DrawingElement => ({
    id, type: "chair", x, y, width: 40, height: 40, rotation: 0, locked: false, ...overrides,
  });

  it("normaliza a área ao arrastar em qualquer direção", () => {
    expect(selectionArea({ x: 300, y: 250 }, { x: 100, y: 50 })).toEqual({
      x: 100, y: 50, width: 200, height: 200,
    });
  });

  it("seleciona todos os elementos que tocam a área e ignora os demais", () => {
    const elements = [element("dentro", 100, 100), element("borda", 220, 100), element("fora", 300, 100)];
    expect(selectElementsInArea(elements, { x: 80, y: 80, width: 120, height: 40 }))
      .toEqual(["dentro", "borda"]);
  });

  it("considera o contorno de elementos rotacionados", () => {
    const rotated = element("girado", 100, 100, { width: 100, height: 20, rotation: 45 });
    expect(selectElementsInArea([rotated], { x: 130, y: 130, width: 10, height: 10 }))
      .toEqual(["girado"]);
  });

  it("retorna uma seleção vazia quando a área não toca elementos", () => {
    expect(selectElementsInArea([element("cadeira", 100, 100)], { x: 400, y: 400, width: 50, height: 50 }))
      .toEqual([]);
  });
});

describe("camadas", () => {
  it("sempre coloca os cômodos antes dos demais elementos", () => {
    const chair = createElement("chair", []);
    const firstRoom = createElement("room", []);
    const computer = createElement("computer", []);
    const secondRoom = createElement("room", []);
    const ordered = orderElementsForDisplay([chair, firstRoom, computer, secondRoom]);
    expect(ordered.map((element) => element.type)).toEqual([
      "room",
      "room",
      "chair",
      "computer",
    ]);
  });
});
