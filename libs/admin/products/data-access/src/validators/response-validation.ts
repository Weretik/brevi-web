export function record(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Некоректна відповідь сервера.');
  }
  return value as Record<string, unknown>;
}

export function number(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function fields(
  value: unknown,
  stringFields: string[],
  numberFields: string[] = [],
): boolean {
  const item = record(value);
  return (
    stringFields.every((field) => typeof item[field] === 'string') &&
    numberFields.every((field) => number(item[field]))
  );
}

export function entries(value: unknown, check: (item: unknown) => boolean): boolean {
  return Array.isArray(value) && value.every(check);
}
