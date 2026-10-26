import type { SewingCompositionDraft } from '../../entities/sewing-composition';

export function emptySewingCompositionDraft(
  productId: number,
  articleId: number | null = null,
): SewingCompositionDraft {
  return {
    productId,
    articleId,
    modelCode: null,
    version: 0,
    modelMaterials: [],
    articleMaterials: [],
    operations: [],
  };
}
