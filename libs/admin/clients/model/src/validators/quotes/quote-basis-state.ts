import { sameQuoteSelection } from '../../mappers/quotes/same-quote-selection';

import type { QuoteVariantDraft } from '../../models/quotes/quote-variant-draft';

export function quoteBasisState(
  variant: QuoteVariantDraft,
  now: number,
): 'missing' | 'changed' | 'expired' | 'blocked' | 'valid' {
  if (!variant.basis) return 'missing';
  const { origin, value } = variant.basis;
  if (!value.token.trim() || (origin === 'saved' && !variant.publicId?.trim())) return 'missing';
  if (!sameQuoteSelection(variant.selection, value.selection)) return 'changed';
  if (origin === 'preview' && (!Number.isFinite(value.expiresAt) || value.expiresAt <= now))
    return 'expired';
  if (
    value.blockers.length > 0 ||
    [value.retail, value.wholesale, value.largeWholesale].some(
      (price) => price === null || !Number.isFinite(price) || price < 0,
    )
  )
    return 'blocked';
  return 'valid';
}
