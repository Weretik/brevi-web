export function ordered<T extends { sortOrder: number }>(items: readonly T[]): T[] {
  return [...items].sort((left, right) => left.sortOrder - right.sortOrder);
}

export function normalizeOrder<T extends { sortOrder: number }>(items: readonly T[]): T[] {
  return items.map((item, sortOrder) => ({ ...item, sortOrder }));
}

export function moveOrdered<T extends { sortOrder: number }>(
  items: readonly T[],
  index: number,
  direction: -1 | 1,
): T[] {
  const result = ordered(items);
  const destination = index + direction;
  if (destination < 0 || destination >= result.length) return normalizeOrder(result);
  [result[index], result[destination]] = [result[destination], result[index]];
  return normalizeOrder(result);
}

export function removeOrdered<T extends { sortOrder: number }>(
  items: readonly T[],
  index: number,
): T[] {
  return normalizeOrder(ordered(items).filter((_, position) => position !== index));
}
