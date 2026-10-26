export function sewingResponseInteger(value: unknown, minimum = 0): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= minimum;
}

export function sewingResponsePositive(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

export function sewingResponseNullableText(value: unknown): boolean {
  return value === null || typeof value === 'string';
}

export function sewingResponseNullableId(value: unknown): boolean {
  return value === null || sewingResponseInteger(value, 1);
}

export function ensureSewingResponse(valid: boolean): asserts valid {
  if (!valid) throw new Error('Некоректна відповідь щодо артикулів або складу виробу.');
}
