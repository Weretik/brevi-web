import type { QuotePriceBasis } from '../../entities/quotes/quote-price-basis';

export interface QuoteRepriceRow {
  readonly variantId: string;
  readonly title: string;
  readonly previous: QuotePriceBasis;
  readonly next: QuotePriceBasis;
}
