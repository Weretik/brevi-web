import type { QuotePriceBasis } from '../../entities/quotes/quote-price-basis';
import type { QuotePriceSelection } from '../../entities/quotes/quote-price-selection';

export interface QuoteVariantDraft {
  readonly key: string;
  readonly publicId?: string;
  readonly title: string;
  readonly visible: boolean;
  readonly selection: QuotePriceSelection;
  readonly tierVisibility: {
    readonly retail: boolean;
    readonly wholesale: boolean;
    readonly largeWholesale: boolean;
  };
  readonly basis: { readonly origin: 'saved' | 'preview'; readonly value: QuotePriceBasis } | null;
}
