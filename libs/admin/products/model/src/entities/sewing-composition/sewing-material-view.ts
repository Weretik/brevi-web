import type { SewingMaterialDraft } from './sewing-material-draft';
import type { SewingMaterialScope } from './sewing-material-scope';

export interface SewingMaterialView extends Omit<SewingMaterialDraft, 'clientId'> {
  id: number;
  articleId: number | null;
  scope: SewingMaterialScope;
  reviewedBy: string | null;
  reviewedAt: string | null;
}
