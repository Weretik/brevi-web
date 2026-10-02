export interface GarmentAccessoryFormValues {
  id: string;
  name: string;
  supplierName: string;
  price: string;
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
  if (!values.name.trim() || values.name.trim().length > 500)
    errors.name = 'Вкажіть назву до 500 символів.';
  if (!values.supplierName.trim()) errors.supplierName = 'Оберіть постачальника.';
  if (!values.price.trim() || !Number.isFinite(price) || price < 0 || price > 10000)
    errors.price = 'Вкажіть ціну від 0 до 10000.';
  return errors;
}
