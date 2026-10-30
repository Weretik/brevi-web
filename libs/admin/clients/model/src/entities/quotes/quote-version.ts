import type { QuoteDraft } from '../../models/quotes/quote-draft';

export interface QuoteVersion {
  readonly publicId: string;
  readonly versionNumber: number;
  readonly action: 'created' | 'edited' | 'recalculated' | 'copied';
  readonly actorId: number;
  readonly createdAt: string;
  readonly draft: QuoteDraft;
}
