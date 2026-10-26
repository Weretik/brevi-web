import type { SewingMaterialDraft } from '../../entities/sewing-composition/sewing-material-draft';

export function applySewingMaterialUpdate(
  item: SewingMaterialDraft,
  update: Partial<SewingMaterialDraft>,
): SewingMaterialDraft {
  const requiresReview = ['kind', 'referenceId', 'costCode', 'quantity', 'unit', 'required'].some(
    (field) => field in update,
  );
  return {
    ...item,
    ...update,
    reviewed: requiresReview ? false : (update.reviewed ?? item.reviewed),
  };
}
