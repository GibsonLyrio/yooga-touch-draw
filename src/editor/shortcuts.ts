export type EditorShortcut = "undo" | "redo" | "copy" | "paste";

interface ShortcutEvent {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}

export function resolveEditorShortcut(
  event: ShortcutEvent,
  isEditingText: boolean,
): EditorShortcut | null {
  if (isEditingText || (!event.ctrlKey && !event.metaKey) || event.altKey)
    return null;
  const key = event.key.toLowerCase();
  if (key === "z") return event.shiftKey ? "redo" : "undo";
  if (event.shiftKey) return null;
  if (key === "c") return "copy";
  if (key === "v") return "paste";
  return null;
}
