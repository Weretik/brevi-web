import type { QuoteDraft } from '../../models/quotes/quote-draft';

export interface QuoteDetail {
  readonly publicId: string;
  readonly versionId: string;
  readonly sourceQuoteId: string | null;
  readonly sourceVersionId: string | null;
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
