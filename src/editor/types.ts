export type ElementType = "round-table" | "rect-table" | "chair" | "wall";

export interface DrawingElement {
  id: string;
  type: ElementType;
  /** Centro do objeto em coordenadas lógicas da cena. */
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface Point {
  x: number;
  y: number;
}
