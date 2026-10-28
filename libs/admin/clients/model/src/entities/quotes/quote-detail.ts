import type { QuoteDraft } from '../../models/quotes/quote-draft';

export interface QuoteDetail {
  readonly publicId: string;
  readonly revision: number;
  readonly versionNumber: number;
  readonly state: 'draft' | 'ready' | 'sent';
  readonly archived: boolean;
  readonly number: string | null;
  readonly ownerId: number;
  readonly versionActorId: number;
  readonly updatedAt: string;
  readonly canEdit: boolean;
  readonly draft: QuoteDraft;
}
