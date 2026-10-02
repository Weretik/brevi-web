export interface FabricFormValues {
  id: string;
  name: string;
  providerName: string;
  price: string;
}

export type FabricField = keyof FabricFormValues;
export type FabricFieldErrors = Partial<Record<FabricField, string>>;

export function validateFabric(values: FabricFormValues): FabricFieldErrors {
  const errors: FabricFieldErrors = {};
  const id = Number(values.id);
  const price = Number(values.price);
  if (!Number.isInteger(id) || id <= 0) errors.id = 'Вкажіть додатний цілий ID.';
  if (!values.name.trim() || values.name.trim().length > 500)
    errors.name = 'Вкажіть назву до 500 символів.';
  if (!values.providerName.trim() || values.providerName.trim().length > 200)
    errors.providerName = 'Оберіть постачальника до 200 символів.';
  if (!values.price.trim() || !Number.isFinite(price) || price < 0 || price > 10000)
    errors.price = 'Вкажіть ціну від 0 до 10000.';
  return errors;
}
