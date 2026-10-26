import type { SewingOperationDraft } from './sewing-operation-draft';

export interface SewingOperationView extends Omit<SewingOperationDraft, 'clientId'> {
  id: number;
  reviewedBy: string | null;
  reviewedAt: string | null;
}
