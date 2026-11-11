export interface FabricColorFormValues {
  name: string;
  isActive: boolean;
}

export type FabricColorField = keyof FabricColorFormValues;
export type FabricColorFieldErrors = Partial<Record<FabricColorField, string>>;

/** The same limit as BreviERP `FabricColor` and a colour of a stock line. */
export const fabricColorNameMaxLength = 80;

/** Two names are the same colour when they differ only in case or spaces (BreviERP REF-006). */
export function fabricColorKey(name: string): string {
  return name.replace(/\s+/g, '').toLocaleLowerCase('uk');
}

export function validateFabricColor(
  values: FabricColorFormValues,
  others: readonly { name: string }[] = [],
): FabricColorFieldErrors {
  const errors: FabricColorFieldErrors = {};
  const name = values.name.trim();
  if (!name) errors.name = 'Вкажіть назву кольору.';
  else if (name.length > fabricColorNameMaxLength)
    errors.name = `Не більше ${fabricColorNameMaxLength} символів.`;
  else if (others.some((other) => fabricColorKey(other.name) === fabricColorKey(name)))
    errors.name = 'Такий колір уже є в довіднику.';
  return errors;
}
