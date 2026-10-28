import type { QuoteItemDraft } from './quote-item-draft';

export interface QuoteDraft {
  readonly customerId: string | null;
  readonly contactId: string | null;
  readonly recipientName: string;
  readonly items: readonly QuoteItemDraft[];
}
