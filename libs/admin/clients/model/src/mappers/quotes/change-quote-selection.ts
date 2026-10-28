import { sameQuoteSelection } from './same-quote-selection';

import type { QuotePriceSelection } from '../../entities/quotes/quote-price-selection';
import type { QuoteVariantDraft } from '../../models/quotes/quote-variant-draft';

export function changeQuoteSelection(
  variant: QuoteVariantDraft,
  selection: QuotePriceSelection,
): QuoteVariantDraft {
  return {
    ...variant,
    selection,
    basis: sameQuoteSelection(variant.selection, selection) ? variant.basis : null,
  };
}
