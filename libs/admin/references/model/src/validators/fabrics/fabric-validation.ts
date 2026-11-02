export interface FabricFormValues {
  id: string;
  code: string;
  name: string;
  nameRu: string;
  providerName: string;
  composition: string;
  compositionRu: string;
  density: string;
  price: string;
  isActive: boolean;
  comment: string;
  proposalDescription: string;
}

export type FabricField = keyof FabricFormValues;
export type FabricFieldErrors = Partial<Record<FabricField, string>>;

/** Text limits shared with BreviERP `Fabric`. */
export const fabricTextLimits = {
  code: 20,
  name: 500,
  nameRu: 500,
  composition: 500,
  compositionRu: 500,
  density: 100,
  comment: 1000,
  proposalDescription: 1000,
} as const satisfies Partial<Record<FabricField, number>>;

export function validateFabric(values: FabricFormValues): FabricFieldErrors {
  const errors: FabricFieldErrors = {};
  const id = Number(values.id);
  const price = Number(values.price);
  if (!Number.isInteger(id) || id <= 0) errors.id = 'Вкажіть додатний цілий ID.';
  if (!values.name.trim() || values.name.trim().length > fabricTextLimits.name)
    errors.name = 'Вкажіть назву до 500 символів.';
  if (!values.providerName.trim() || values.providerName.trim().length > 200)
    errors.providerName = 'Оберіть постачальника.';
  if (!values.price.trim() || !Number.isFinite(price) || price < 0 || price > 10000)
    errors.price = 'Вкажіть ціну від 0 до 10000.';
  for (const [field, limit] of Object.entries(fabricTextLimits) as [
    keyof typeof fabricTextLimits,
    number,
  ][]) {
    if (field !== 'name' && values[field].trim().length > limit)
      errors[field] = `Не більше ${limit} символів.`;
  }
  return errors;
}
