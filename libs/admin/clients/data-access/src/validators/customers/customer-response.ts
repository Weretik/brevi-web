export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Некоректна відповідь клієнтського API.');
  return value as Record<string, unknown>;
}
export function text(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Некоректне текстове поле клієнта.');
  return value;
}
export function nullableText(value: unknown): string | null {
  return value === null ? null : text(value);
}
export function flag(value: unknown): boolean {
  if (typeof value !== 'boolean') throw new Error('Некоректний стан клієнта.');
  return value;
}
export function integer(value: unknown, minimum = 1): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < minimum)
    throw new Error('Некоректне число у відповіді клієнтів.');
  return value;
}
export function identifier(value: unknown): string {
  const id = text(value);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))
    throw new Error('Некоректний ідентифікатор клієнта.');
  return id;
}
export function items(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new Error('Некоректний список у відповіді клієнта.');
  return value;
}
