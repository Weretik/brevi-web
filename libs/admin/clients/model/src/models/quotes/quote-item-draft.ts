import type { QuoteVariantDraft } from './quote-variant-draft';

export interface QuoteItemDraft {
  readonly key: string;
  readonly publicId?: string;
  readonly title: string;
  readonly publicDescription: string;
  readonly publicComment: string;
  readonly internalNote: string;
  readonly included: boolean;
  readonly variants: readonly QuoteVariantDraft[];
}
