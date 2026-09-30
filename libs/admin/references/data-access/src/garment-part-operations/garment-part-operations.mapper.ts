import type { GarmentPartOperation } from './garment-part-operations.model';
import type { operations } from '@admin/api-contract';

type OperationsResponse =
  operations['getGarmentPartOperations']['responses'][200]['content']['application/json'];

export function mapGarmentPartOperations(value: unknown): GarmentPartOperation[] {
  if (!Array.isArray(value)) throw new Error('Некоректна відповідь списку робіт.');
  return value.map((item: unknown) => {
    if (!item || typeof item !== 'object') throw new Error('Некоректна робота.');
    const row = item as Record<string, unknown>;
    if (
      !Number.isInteger(row['id']) ||
      (row['id'] as number) <= 0 ||
      typeof row['garmentPartName'] !== 'string' ||
      typeof row['name'] !== 'string' ||
      typeof row['min'] !== 'number' ||
      !Number.isFinite(row['min']) ||
      row['min'] < 0
    )
      throw new Error('Некоректна робота.');
    const validRow = row as OperationsResponse[number];
    return {
      id: validRow.id,
      garmentPartName: validRow.garmentPartName,
      name: validRow.name,
      min: validRow.min,
    };
  });
}
