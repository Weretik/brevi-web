import type { SewingMaterialDraft } from './sewing-material-draft';
import type { SewingOperationDraft } from './sewing-operation-draft';

export interface SewingCompositionDraft {
  productId: number;
  articleId: number | null;
  modelCode: string | null;
  version: number;
  modelMaterials: SewingMaterialDraft[];
  articleMaterials: SewingMaterialDraft[];
  operations: SewingOperationDraft[];
}
