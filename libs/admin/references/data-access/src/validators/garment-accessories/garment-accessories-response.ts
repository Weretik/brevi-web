import { isGarmentAccessoryUnit } from '@admin/references/model';

import type { GarmentAccessoriesResponse } from '../../contracts/garment-accessories/garment-accessories-response';

export function parseGarmentAccessoriesResponse(value: unknown): GarmentAccessoriesResponse {
  if (!Array.isArray(value)) throw new Error('Некоректна відповідь списку фурнітури.');
  for (const item of value) {
    const row = item as Record<string, unknown> | null;
    if (
      !row ||
      typeof row !== 'object' ||
      !Number.isInteger(row['id']) ||
      (row['id'] as number) <= 0 ||
      typeof row['name'] !== 'string' ||
      typeof row['supplierName'] !== 'string' ||
      typeof row['price'] !== 'number' ||
      !Number.isFinite(row['price']) ||
      (row['price'] as number) < 0 ||
      !isGarmentAccessoryUnit(row['unit']) ||
      typeof row['isActive'] !== 'boolean' ||
      ['code', 'priceUpdatedAt', 'comment'].some(
        (field) => row[field] !== null && typeof row[field] !== 'string',
      )
    ) {
      throw new Error('Некоректний запис фурнітури.');
    }
  }
  return value as GarmentAccessoriesResponse;
}
