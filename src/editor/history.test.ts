import { describe, expect, it } from "vitest";
import { recordSnapshot, redoSnapshot, undoSnapshot } from "./history";
import { resolveEditorShortcut } from "./shortcuts";

const keyboard = (key: string, overrides = {}) => ({
  key,
  ctrlKey: true,
  metaKey: false,
  altKey: false,
  shiftKey: false,
  ...overrides,
});

describe("histórico de edição", () => {
  it("desfaz e refaz restaurando os estados completos", () => {
    const empty: string[] = [];
    const one = ["mesa"];
    const two = ["mesa", "cadeira"];
    const past = recordSnapshot(recordSnapshot([], empty), one);

    const undone = undoSnapshot(past, two, []);
    expect(undone).toEqual({ past: [empty], present: one, future: [two] });
    expect(redoSnapshot(undone!.past, undone!.present, undone!.future)).toEqual({
      past: [empty, one],
      present: two,
      future: [],
    });
  });

  it("limita o histórico às 100 ações mais recentes", () => {
    let past: number[] = [];
    for (let value = 0; value < 105; value++) past = recordSnapshot(past, value);
    expect(past).toHaveLength(100);
    expect(past[0]).toBe(5);
  });
});

describe("atalhos do editor", () => {
  it.each([
    [keyboard("z"), "undo"],
    [keyboard("z", { shiftKey: true }), "redo"],
    [keyboard("c"), "copy"],
    [keyboard("v"), "paste"],
    [keyboard("z", { ctrlKey: false, metaKey: true }), "undo"],
  ] as const)("resolve %o como %s", (event, expected) => {
    expect(resolveEditorShortcut(event, false)).toBe(expected);
  });

  it("preserva atalhos nativos enquanto o usuário edita texto", () => {
    expect(resolveEditorShortcut(keyboard("z"), true)).toBeNull();
    expect(resolveEditorShortcut(keyboard("c"), true)).toBeNull();
  });
});
