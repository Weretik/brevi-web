import type { SewingMaterialDraft } from '../materials/sewing-material-draft';
import type { SewingOperationDraft } from '../operations/sewing-operation-draft';

/** The shared composition of a model as it is sent to `replaceSewingComposition` (CAT-015). */
export interface SewingCompositionDraft {
  productId: number;
  modelCode: string | null;
  version: number;
  modelMaterials: SewingMaterialDraft[];
  operations: SewingOperationDraft[];
}
