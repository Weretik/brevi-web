import type { QuotePriceSelection } from './quote-price-selection';
import type { QuotePriceSource } from './quote-price-source';

export interface QuotePriceBasis {
  readonly token: string;
  readonly source?: QuotePriceSource | null;
  readonly expiresAt: number;
  readonly selection: QuotePriceSelection;
  readonly retail: number | null;
  readonly wholesale: number | null;
  readonly largeWholesale: number | null;
  readonly blockers: readonly string[];
  readonly currency: 'UAH';
  readonly taxBasis: 'catalog_no_extra_vat' | 'manual_no_extra_vat' | 'custom_no_extra_vat';
}
