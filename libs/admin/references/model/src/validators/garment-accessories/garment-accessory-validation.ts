import { isGarmentAccessoryUnit } from '../../entities/garment-accessories/garment-accessory';

import type { GarmentAccessoryUnit } from '../../entities/garment-accessories/garment-accessory';

export interface GarmentAccessoryFormValues {
  id: string;
  code: string;
  name: string;
  supplierName: string;
  price: string;
  unit: GarmentAccessoryUnit;
  isActive: boolean;
  comment: string;
}

export type GarmentAccessoryField = keyof GarmentAccessoryFormValues;
export type GarmentAccessoryFieldErrors = Partial<Record<GarmentAccessoryField, string>>;

export function validateGarmentAccessory(
  values: GarmentAccessoryFormValues,
): GarmentAccessoryFieldErrors {
  const errors: GarmentAccessoryFieldErrors = {};
  const id = Number(values.id);
  const price = Number(values.price);
  if (!Number.isInteger(id) || id <= 0) errors.id = 'Вкажіть додатний цілий ID.';
  if (values.code.trim().length > 20) errors.code = 'Не більше 20 символів.';
  if (!values.name.trim() || values.name.trim().length > 500)
    errors.name = 'Вкажіть назву до 500 символів.';
  if (!values.supplierName.trim()) errors.supplierName = 'Оберіть постачальника.';
  if (!values.price.trim() || !Number.isFinite(price) || price < 0 || price > 10000)
    errors.price = 'Вкажіть ціну від 0 до 10000.';
  if (!isGarmentAccessoryUnit(values.unit)) errors.unit = 'Оберіть одиницю: шт., м або послуга.';
  if (values.comment.trim().length > 1000) errors.comment = 'Не більше 1000 символів.';
  return errors;
}
