export function quoteRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Некоректна відповідь API КП.');
  return value as Record<string, unknown>;
}
export function quoteText(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Некоректний текст КП.');
  return value;
}
export function quoteId(value: unknown): string {
  const id = quoteText(value);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))
    throw new Error('Некоректний ідентифікатор КП.');
  return id;
}
export function quoteInteger(value: unknown, minimum = 1): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < minimum)
    throw new Error('Некоректне число КП.');
  return value;
}
export function quoteFlag(value: unknown): boolean {
  if (typeof value !== 'boolean') throw new Error('Некоректний прапорець КП.');
  return value;
}
export function quoteArray(value: unknown, maximum = 100): unknown[] {
  if (!Array.isArray(value) || value.length > maximum) throw new Error('Некоректний список КП.');
  return value;
}
export function quoteMoney(value: unknown): number | null {
  if (value === null) return null;
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < 0 ||
    !/^\d+(?:\.\d{1,2})?$/.test(String(value))
  )
    throw new Error('Некоректна ціна КП.');
  return value;
}
export function quoteDate(value: unknown): string {
  const date = quoteText(value);
  if (!Number.isFinite(Date.parse(date))) throw new Error('Некоректна дата КП.');
  return date;
}
export function quotePositiveMoney(value: unknown): number {
  const amount = quoteMoney(value);
  if (amount === null || amount <= 0) throw new Error('Ручна ціна має бути додатною.');
  return amount;
}
export function quoteNullableId(value: unknown): string | null {
  return value == null ? null : quoteId(value);
}
export function quoteNullableText(value: unknown): string | null {
  return value == null ? null : quoteText(value);
}
export function quoteState(value: unknown): 'draft' | 'ready' | 'sent' {
  if (value !== 'draft' && value !== 'ready' && value !== 'sent')
    throw new Error('Невідомий стан КП.');
  return value;
}
