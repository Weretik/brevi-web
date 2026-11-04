import { parseSewingMetres } from '../sewing-variant/sewing-variant-form';

import type { SewingOperationDraft } from '../../entities/sewing-composition';

/** Side panel «Операція» of «Трудовитрати». Empty manual time means the reference norm. */
export interface SewingOperationFormValues {
  operationId: number | null;
  quantity: string;
  manualMinutes: string;
  comment: string;
}

export type SewingOperationField = keyof SewingOperationFormValues;
export type SewingOperationFieldErrors = Partial<Record<SewingOperationField, string>>;

const decimal = (value: number) => String(value).replace('.', ',');

export function createSewingOperationFormValues(
  operation: SewingOperationDraft | null,
): SewingOperationFormValues {
  return {
    operationId: operation?.operationId ?? null,
    quantity: operation ? decimal(operation.quantity) : '1',
    manualMinutes: operation?.manualMinutes == null ? '' : decimal(operation.manualMinutes),
    comment: operation?.comment ?? '',
  };
}

export function sewingOperationFromForm(
  values: SewingOperationFormValues,
  clientId: string,
  sortOrder: number,
): SewingOperationDraft {
  return {
    clientId,
    operationId: values.operationId ?? 0,
    quantity: parseSewingMetres(values.quantity),
    manualMinutes: values.manualMinutes.trim() ? parseSewingMetres(values.manualMinutes) : null,
    sortOrder,
    comment: values.comment.trim(),
  };
}

export function validateSewingOperationForm(
  values: SewingOperationFormValues,
): SewingOperationFieldErrors {
  const errors: SewingOperationFieldErrors = {};
  if (!values.operationId) errors.operationId = 'Оберіть операцію.';
  const quantity = parseSewingMetres(values.quantity);
  if (!Number.isFinite(quantity) || quantity <= 0) errors.quantity = 'Вкажіть кількість більше 0.';
  if (values.manualMinutes.trim()) {
    const minutes = parseSewingMetres(values.manualMinutes);
    if (!Number.isFinite(minutes) || minutes <= 0)
      errors.manualMinutes = 'Вкажіть час більше 0 або залиште поле порожнім.';
  }
  if (values.comment.trim().length > 500) errors.comment = 'Коментар — до 500 символів.';
  return errors;
}
