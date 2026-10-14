export type ElementType =
  | "room"
  | "round-table"
  | "rect-table"
  | "chair"
  | "printer"
  | "computer"
  | "checkout"
  | "kitchen"
  | "bar"
  | "stock"
  | "fridge";

export interface DrawingElement {
  id: string;
  type: ElementType;
  /** Centro do objeto em coordenadas lógicas da cena. */
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  locked: boolean;
  roomName?: string;
}

export interface Point {
  x: number;
  y: number;
}
