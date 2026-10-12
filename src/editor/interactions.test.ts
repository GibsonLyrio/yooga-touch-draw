import { describe, expect, it, vi } from "vitest";
import { createElement, ELEMENTS, SCENE_HEIGHT, SCENE_WIDTH } from "./elements";
import {
  moveElement,
  resizeElement,
  rotateElement,
  rotatedBounds,
} from "./interactions";
import type { DrawingElement, ElementType } from "./types";

describe("inserção", () => {
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
});
