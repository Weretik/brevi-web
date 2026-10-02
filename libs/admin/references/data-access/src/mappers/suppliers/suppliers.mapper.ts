import type { Supplier } from '@admin/references/model';
import type { operations } from '@admin/shared/contracts';

type SupplierResponse = operations['getSuppliers']['responses'][200]['content']['application/json'];

export function mapSuppliers(value: unknown): Supplier[] {
  if (!Array.isArray(value)) throw new Error('Некоректна відповідь списку постачальників.');
  return value.map((item: unknown): Supplier => {
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
      if (row[field] !== null && typeof row[field] !== 'string')
        throw new Error('Некоректний запис постачальника.');
    }
    return row as unknown as SupplierResponse[number];
  });
}
