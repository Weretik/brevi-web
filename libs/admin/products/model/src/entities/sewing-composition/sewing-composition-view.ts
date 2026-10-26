import type { SewingMaterialView } from './sewing-material-view';
import type { SewingOperationView } from './sewing-operation-view';

export interface SewingCompositionView {
  productId: number;
  articleId: number | null;
  modelCode: string | null;
  version: number;
  materials: SewingMaterialView[];
  operations: SewingOperationView[];
  blockers: string[];
}
