export function record(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Некоректна відповідь сервера.');
  }
  return value as Record<string, unknown>;
}

export function number(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}
