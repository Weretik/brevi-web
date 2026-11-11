const invalid = (what: string) => new Error(`Некоректна відповідь складу: ${what}.`);

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

export function nonEmptyText(value: unknown, what = 'текст'): string {
  const result = text(value, what);
  if (!result.trim()) throw invalid(what);
  return result;
}

export function nullableText(value: unknown, what = 'текст'): string | null {
  return value === null || value === undefined ? null : text(value, what);
}

export function integer(value: unknown, what = 'число', minimum = 0): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < minimum)
    throw invalid(what);
  return value;
}

export function nullableInteger(value: unknown, what = 'число', minimum = 0): number | null {
  return value === null || value === undefined ? null : integer(value, what, minimum);
}

export function dateTime(value: unknown, what = 'час'): string {
  const date = text(value, what);
  if (Number.isNaN(Date.parse(date))) throw invalid(what);
  return date;
}

export function boolean(value: unknown, what = 'ознака'): boolean {
  if (typeof value !== 'boolean') throw invalid(what);
  return value;
}

/** A finite number, negative allowed (stock balances may go below zero). */
export function decimal(value: unknown, what = 'число'): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw invalid(what);
  return value;
}

export function nullableNumber(value: unknown, what = 'число'): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'number' || !Number.isFinite(value)) throw invalid(what);
  return value;
}

export function oneOf<T extends string>(value: unknown, allowed: readonly T[], what: string): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) throw invalid(what);
  return value as T;
}

/** A calendar day yyyy-mm-dd. */
export function day(value: unknown, what: string): string {
  const result = text(value, what);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result)) throw invalid(what);
  return result;
}
