import type { SewingMaterialDraft } from '../../entities/sewing-composition/sewing-material-draft';

export function applySewingMaterialUpdate(
  item: SewingMaterialDraft,
  update: Partial<SewingMaterialDraft>,
): SewingMaterialDraft {
  return { ...item, ...update };
}
