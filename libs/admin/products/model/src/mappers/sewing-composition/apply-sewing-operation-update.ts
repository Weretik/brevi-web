import type { SewingOperationDraft } from '../../entities/sewing-composition/sewing-operation-draft';

export function applySewingOperationUpdate(
  item: SewingOperationDraft,
  update: Partial<SewingOperationDraft>,
): SewingOperationDraft {
  return { ...item, ...update };
}
