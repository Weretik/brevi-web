import type { SewingMaterialView } from '../materials/sewing-material-view';
import type { SewingOperationView } from '../operations/sewing-operation-view';

export interface SewingCompositionView {
  productId: number;
  articleId: number | null;
  modelCode: string | null;
  version: number;
  materials: SewingMaterialView[];
  operations: SewingOperationView[];
  blockers: string[];
}
