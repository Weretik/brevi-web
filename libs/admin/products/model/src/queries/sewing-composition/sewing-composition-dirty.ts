import type { SewingCompositionDraft } from '../../entities/sewing-composition';

export function isSewingCompositionDirty(
  current: SewingCompositionDraft,
  original: SewingCompositionDraft,
): boolean {
  return JSON.stringify(current) !== JSON.stringify(original);
}
