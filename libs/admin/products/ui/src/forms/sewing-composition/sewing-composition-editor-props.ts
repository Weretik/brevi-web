import type { ProductLookups } from '../../product-editor/core/product-lookups';
import type { SewingMaterialDraft, SewingOperationDraft } from '@admin/products/model';

export interface SewingCompositionEditorProps {
  scope: 'Model' | 'Article';
  articleSku?: string | null;
  version: number;
  materials: SewingMaterialDraft[];
  operations: SewingOperationDraft[];
  lookups: Pick<ProductLookups, 'fabrics' | 'accessories' | 'operations'>;
  canManage: boolean;
  dirty: boolean;
  saving?: boolean;
  errors?: Record<string, string>;
  blockers?: string[];
  /** Which part to show; the sewing card shows materials and operations on separate tabs. */
  sections?: 'all' | 'materials' | 'operations';
  error?: string | null;
  onMaterialsChange: (materials: SewingMaterialDraft[]) => void;
  onOperationsChange: (operations: SewingOperationDraft[]) => void;
  onSave: () => void;
  onCancel: () => void;
}
