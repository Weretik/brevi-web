import type { GarmentAccessory } from './garment-accessories.model';
import type { operations } from '@admin/api-contract';

type GarmentAccessoryResponse =
  operations['getGarmentAccessories']['responses'][200]['content']['application/json'];

export function mapGarmentAccessories(value: unknown): GarmentAccessory[] {
  if (!Array.isArray(value)) throw new Error('Некоректна відповідь списку фурнітури.');
  return value.map((item: unknown) => {
    if (!item || typeof item !== 'object') throw new Error('Некоректний запис фурнітури.');
    const row = item as Record<string, unknown>;
    if (
      !Number.isInteger(row['id']) ||
      (row['id'] as number) <= 0 ||
      typeof row['name'] !== 'string' ||
      typeof row['supplierName'] !== 'string' ||
      typeof row['price'] !== 'number' ||
      !Number.isFinite(row['price']) ||
      (row['price'] as number) < 0
    )
      throw new Error('Некоректний запис фурнітури.');
    const validRow: GarmentAccessoryResponse[number] = row as GarmentAccessoryResponse[number];
    return {
      id: validRow.id,
      name: validRow.name,
      supplierName: validRow.supplierName,
      price: validRow.price,
    };
  });
}
