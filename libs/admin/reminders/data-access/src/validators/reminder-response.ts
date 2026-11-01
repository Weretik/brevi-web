const invalid = (what: string) => new Error(`Некоректна відповідь API нагадувань: ${what}.`);

export function record(value: unknown, what = 'обʼєкт'): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw invalid(what);
  return value as Record<string, unknown>;
}

export function list(value: unknown, what = 'список'): unknown[] {
  if (!Array.isArray(value)) throw invalid(what);
  return value;
}

export function text(value: unknown, what = 'текст'): string {
  if (typeof value !== 'string') throw invalid(what);
  return value;
}

export function nullableText(value: unknown, what = 'текст'): string | null {
  return value === null || value === undefined ? null : text(value, what);
}

export function flag(value: unknown, what = 'прапорець'): boolean {
  if (typeof value !== 'boolean') throw invalid(what);
  return value;
}

export function integer(value: unknown, what = 'число', minimum = 0): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < minimum)
    throw invalid(what);
  return value;
}

export function nullableInteger(value: unknown, what = 'число'): number | null {
  return value === null || value === undefined ? null : integer(value, what);
}

export function isoDate(value: unknown, what = 'дата'): string {
  const date = text(value, what);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw invalid(what);
  return date;
}

export function nullableIsoDate(value: unknown, what = 'дата'): string | null {
  return value === null || value === undefined ? null : isoDate(value, what);
}

export function dateTime(value: unknown, what = 'час'): string {
  const date = text(value, what);
  if (Number.isNaN(Date.parse(date))) throw invalid(what);
  return date;
}

export function nullableDateTime(value: unknown, what = 'час'): string | null {
  return value === null || value === undefined ? null : dateTime(value, what);
}

export function oneOf<T extends string>(value: unknown, allowed: readonly T[], what: string): T {
  if (typeof value !== 'string' || !(allowed as readonly string[]).includes(value))
    throw invalid(what);
  return value as T;
}
