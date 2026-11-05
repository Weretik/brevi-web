import type { CategoryDirection } from '../../entities/categories/finance-category';

export interface FinanceCategoryFormValues {
  name: string;
  direction: CategoryDirection;
  /** Empty for a root category. */
  parentId: string;
  note: string;
}

export type FinanceCategoryField = keyof FinanceCategoryFormValues;
export type FinanceCategoryFieldErrors = Partial<Record<FinanceCategoryField, string>>;

/** Limits shared with BreviERP `FinanceCategory`. */
export const financeCategoryLimits = { name: 120, note: 600 } as const;

export function validateFinanceCategory(
  values: FinanceCategoryFormValues,
): FinanceCategoryFieldErrors {
  const errors: FinanceCategoryFieldErrors = {};
  const name = values.name.trim();
  if (!name) errors.name = 'Вкажіть назву категорії.';
  else if (name.length > financeCategoryLimits.name)
    errors.name = `Не більше ${financeCategoryLimits.name} символів.`;
  if (values.note.trim().length > financeCategoryLimits.note)
    errors.note = `Не більше ${financeCategoryLimits.note} символів.`;
  return errors;
}
