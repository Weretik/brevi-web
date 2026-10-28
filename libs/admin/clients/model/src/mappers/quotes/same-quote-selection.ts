import type { QuotePriceSelection } from '../../entities/quotes/quote-price-selection';

export function sameQuoteSelection(left: QuotePriceSelection, right: QuotePriceSelection): boolean {
  if (left.kind !== right.kind) return false;
  if (left.kind === 'sewing' && right.kind === 'sewing')
    return left.productId === right.productId && left.articleId === right.articleId;
  if (left.kind === 'ppe' && right.kind === 'ppe')
    return (
      left.productId === right.productId &&
      left.override?.tier === right.override?.tier &&
      left.override?.amount === right.override?.amount &&
      left.override?.reason === right.override?.reason
    );
  return (
    left.kind === 'oneOffPpe' &&
    right.kind === 'oneOffPpe' &&
    left.prices.retail === right.prices.retail &&
    left.prices.wholesale === right.prices.wholesale &&
    left.prices.largeWholesale === right.prices.largeWholesale &&
    left.prices.reason === right.prices.reason
  );
}
