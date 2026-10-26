import type { SewingOperationDraft } from '../../entities/sewing-composition';

export function validateSewingOperations(
  operations: readonly SewingOperationDraft[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  operations.forEach((operation, index) => {
    const prefix = `operations.${index}`;
    if (!Number.isInteger(operation.operationId) || operation.operationId < 1)
      errors[`${prefix}.operationId`] = 'Оберіть операцію.';
    if (!Number.isFinite(operation.quantity) || operation.quantity <= 0)
      errors[`${prefix}.quantity`] = 'Вкажіть кількість більше нуля.';
    if (
      operation.manualMinutes !== null &&
      (!Number.isFinite(operation.manualMinutes) || operation.manualMinutes <= 0)
    )
      errors[`${prefix}.manualMinutes`] = 'Вкажіть час більше нуля або залиште поле порожнім.';
  });
  return errors;
}
