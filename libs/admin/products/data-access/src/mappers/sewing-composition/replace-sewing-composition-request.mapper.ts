import { mapSewingMaterialInput } from './sewing-material-input.mapper';
import { mapSewingOperationInput } from './sewing-operation-input.mapper';

import type { SewingCompositionDraft } from '@admin/products/model';
import type { operations } from '@admin/shared/contracts';

export function mapReplaceSewingCompositionRequest(
  draft: SewingCompositionDraft,
): operations['replaceSewingComposition']['requestBody']['content']['application/json'] {
  return {
    modelCode: draft.modelCode,
    expectedVersion: draft.version,
    materials: draft.modelMaterials.map(mapSewingMaterialInput),
    operations: draft.operations.map(mapSewingOperationInput),
  };
}
