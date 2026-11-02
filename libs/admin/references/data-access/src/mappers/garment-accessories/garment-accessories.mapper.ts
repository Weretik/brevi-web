import type { GarmentAccessoriesResponse } from '../../contracts/garment-accessories/garment-accessories-response';
import type { GarmentAccessory } from '@admin/references/model';

export function mapGarmentAccessories(value: GarmentAccessoriesResponse): GarmentAccessory[] {
  return value.map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    supplierName: row.supplierName,
    price: row.price,
    unit: row.unit,
    priceUpdatedAt: row.priceUpdatedAt,
    isActive: row.isActive,
    comment: row.comment,
  }));
}
