import type { GarmentPart } from './garment-parts.model';
import type { operations } from '@admin/api-contract';

type GarmentPartsResponse =
  operations['getGarmentParts']['responses'][200]['content']['application/json'];

export function mapGarmentParts(value: unknown): GarmentPart[] {
  if (!Array.isArray(value)) throw new Error('Некоректна відповідь списку елементів виробу.');
  return value.map((item: unknown) => {
    if (!item || typeof item !== 'object') throw new Error('Некоректний елемент виробу.');
    const row = item as Record<string, unknown>;
    if (
      !Number.isInteger(row['id']) ||
      (row['id'] as number) <= 0 ||
      typeof row['name'] !== 'string'
    ) {
      throw new Error('Некоректний елемент виробу.');
    }
    const validRow = row as GarmentPartsResponse[number];
    return { id: validRow.id, name: validRow.name };
  });
}
