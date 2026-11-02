import { defaultGarmentAccessoryUnit } from '../../entities/garment-accessories/garment-accessory';

import type { GarmentAccessory } from '../../entities/garment-accessories/garment-accessory';
import type { GarmentAccessoryFormValues } from '../../validators/garment-accessories/garment-accessory-validation';

export type GarmentAccessoryEditorMode = 'create' | 'view' | 'edit';

export function createGarmentAccessoryFormValues(
  accessory: GarmentAccessory | null,
  nextId: number,
): GarmentAccessoryFormValues {
  return {
    id: String(accessory?.id ?? nextId),
    code: accessory?.code ?? '',
    name: accessory?.name ?? '',
    supplierName: accessory?.supplierName ?? '',
    price: accessory ? String(accessory.price) : '',
    unit: accessory?.unit ?? defaultGarmentAccessoryUnit,
    isActive: accessory?.isActive ?? true,
    comment: accessory?.comment ?? '',
  };
}
