import type { AdditionalReference } from '../../entities/additional-references/additional-reference';

export const ADDITIONAL_REFERENCE_UNITS = ['шт.', 'грн.', '%'] as const;
export type AdditionalReferenceUnit = (typeof ADDITIONAL_REFERENCE_UNITS)[number];

export function isAdditionalReferenceUnit(unit: string): unit is AdditionalReferenceUnit {
  return ADDITIONAL_REFERENCE_UNITS.some((allowedUnit) => allowedUnit === unit);
}

export type AdditionalReferenceDraft = Omit<AdditionalReference, 'value'> & { value: string };
export type AdditionalReferenceField = Exclude<keyof AdditionalReferenceDraft, 'id'>;
export type AdditionalReferenceFieldErrors = Partial<Record<AdditionalReferenceField, string>>;

export function validateAdditionalReference(
  draft: AdditionalReferenceDraft,
): AdditionalReferenceFieldErrors {
  const errors: AdditionalReferenceFieldErrors = {};
  if (!draft.name.trim()) errors.name = 'Вкажіть назву.';
  else if (draft.name.trim().length > 100) errors.name = 'Назва не може перевищувати 100 символів.';
  if (!draft.key.trim()) errors.key = 'Вкажіть ключ.';
  else if (draft.key.trim().length > 100) errors.key = 'Ключ не може перевищувати 100 символів.';
  if (!draft.value.trim() || !Number.isFinite(Number(draft.value)) || Number(draft.value) < 0)
    errors.value = 'Вкажіть невід’ємне число.';
  if (!isAdditionalReferenceUnit(draft.unit)) errors.unit = 'Оберіть одиницю виміру.';
  if (draft.description && draft.description.length > 255)
    errors.description = 'Опис не може перевищувати 255 символів.';
  return errors;
}
