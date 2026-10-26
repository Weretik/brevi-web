import { mapSewingMaterialInput } from './sewing-material-input.mapper';

import type { SewingCompositionDraft } from '@admin/products/model';
import type { operations } from '@admin/shared/contracts';

export function mapReplaceSewingArticleCompositionRequest(
  draft: SewingCompositionDraft,
): operations['replaceSewingArticleComposition']['requestBody']['content']['application/json'] {
  return {
    expectedVersion: draft.version,
    materials: draft.articleMaterials.map(mapSewingMaterialInput),
  };
}
