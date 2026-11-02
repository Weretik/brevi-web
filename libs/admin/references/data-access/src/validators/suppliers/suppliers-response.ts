import type { SuppliersResponse } from '../../contracts/suppliers/suppliers-response';

export function parseSuppliersResponse(value: unknown): SuppliersResponse {
  if (!Array.isArray(value)) throw new Error('Некоректна відповідь списку постачальників.');
  for (const item of value) {
    if (!item || typeof item !== 'object') throw new Error('Некоректний запис постачальника.');
    const row = item as Record<string, unknown>;
    if (
      !Number.isInteger(row['id']) ||
      (row['id'] as number) <= 0 ||
      typeof row['name'] !== 'string'
    ) {
      throw new Error('Некоректний запис постачальника.');
    }
    for (const field of ['link', 'contactPerson', 'phoneNumber', 'notes']) {
      if (row[field] !== null && typeof row[field] !== 'string') {
        throw new Error('Некоректний запис постачальника.');
      }
    }
  }
  return value as SuppliersResponse;
}
