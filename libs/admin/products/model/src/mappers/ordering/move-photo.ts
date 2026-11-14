/** Moves the photo at `index` one place left (-1) or right (+1); returns the same list at an edge. */
export function movePhoto<T>(list: readonly T[], index: number, step: -1 | 1): T[] {
  const target = index + step;
  if (index < 0 || index >= list.length || target < 0 || target >= list.length) return [...list];
  const next = [...list];
  [next[index], next[target]] = [next[target] as T, next[index] as T];
  return next;
}
