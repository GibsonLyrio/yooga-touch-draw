export interface HistoryTransition<T> {
  past: T[];
  present: T;
  future: T[];
}

export function recordSnapshot<T>(past: T[], current: T, limit = 100): T[] {
  return [...past, current].slice(-limit);
}

export function undoSnapshot<T>(
  past: T[],
  present: T,
  future: T[],
  limit = 100,
): HistoryTransition<T> | null {
  const previous = past.at(-1);
  if (previous === undefined) return null;
  return {
    past: past.slice(0, -1),
    present: previous,
    future: [present, ...future].slice(0, limit),
  };
}

export function redoSnapshot<T>(
  past: T[],
  present: T,
  future: T[],
  limit = 100,
): HistoryTransition<T> | null {
  const next = future[0];
  if (next === undefined) return null;
  return {
    past: recordSnapshot(past, present, limit),
    present: next,
    future: future.slice(1),
  };
}
