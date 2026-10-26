import type { SewingOperationDraft } from '../../entities/sewing-composition/sewing-operation-draft';

export function applySewingOperationUpdate(
  item: SewingOperationDraft,
  update: Partial<SewingOperationDraft>,
): SewingOperationDraft {
  const requiresReview = ['operationId', 'quantity', 'manualMinutes'].some(
    (field) => field in update,
  );
  return {
    ...item,
    ...update,
    reviewed: requiresReview ? false : (update.reviewed ?? item.reviewed),
  };
}
