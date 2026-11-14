const invalid = (what: string) => new Error(`Некоректна відповідь API фонових задач: ${what}.`);

export function record(value: unknown, what: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw invalid(what);
  return value as Record<string, unknown>;
}

export function list(value: unknown, what: string): unknown[] {
  if (!Array.isArray(value)) throw invalid(what);
  return value;
}

export function text(value: unknown, what: string): string {
  if (typeof value !== 'string') throw invalid(what);
  return value;
}

export function nullableText(value: unknown, what: string): string | null {
  return value === null || value === undefined ? null : text(value, what);
}

export function flag(value: unknown, what: string): boolean {
  if (typeof value !== 'boolean') throw invalid(what);
  return value;
}

export function nullableInteger(value: unknown, what: string): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) throw invalid(what);
  return value;
}

export function nullableDateTime(value: unknown, what: string): string | null {
  if (value === null || value === undefined) return null;
  const date = text(value, what);
  if (Number.isNaN(Date.parse(date))) throw invalid(what);
  return date;
}

export function oneOf<T extends string>(value: unknown, allowed: readonly T[], what: string): T {
  if (typeof value !== 'string' || !(allowed as readonly string[]).includes(value))
    throw invalid(what);
  return value as T;
}
