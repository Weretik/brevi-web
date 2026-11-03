import type { SewingArticleSummaryRow } from '../../entities/sewing-card/sewing-article-summary';
import type { SewingPriceTiers } from '../../entities/sewing-pricing/sewing-price-tiers';

export interface SewingAmountRange {
  min: number;
  max: number;
}

export interface SewingCardTotals {
  articles: number;
  ready: number;
  minutes: number | null;
  fullCost: SewingAmountRange | null;
  retail: SewingAmountRange | null;
  /** Articles whose live price differs from the published one or has never been published. */
  unpublished: number;
}

function range(values: number[]): SewingAmountRange | null {
  return values.length ? { min: Math.min(...values), max: Math.max(...values) } : null;
}

function samePrices(left: SewingPriceTiers, right: SewingPriceTiers) {
  return (
    left.retail === right.retail &&
    left.wholesale === right.wholesale &&
    left.largeWholesale === right.largeWholesale
  );
}

export function isSewingPricePublished(row: SewingArticleSummaryRow): boolean {
  return Boolean(row.prices && row.published && samePrices(row.prices, row.published.prices));
}

/** Figures for the card's metric strip. */
export function sewingCardTotals(rows: readonly SewingArticleSummaryRow[]): SewingCardTotals {
  const ready = rows.filter((row) => row.calculated);
  return {
    articles: rows.length,
    ready: ready.length,
    minutes: ready[0]?.minutes ?? null,
    fullCost: range(ready.flatMap((row) => (row.fullCost === null ? [] : [row.fullCost]))),
    retail: range(ready.flatMap((row) => (row.prices ? [row.prices.retail] : []))),
    unpublished: ready.filter((row) => !isSewingPricePublished(row)).length,
  };
}
