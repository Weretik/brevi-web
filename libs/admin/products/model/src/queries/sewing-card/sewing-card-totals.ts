import type { SewingArticleSummaryRow } from '../../entities/sewing-card/sewing-article-summary';
import type { SewingCostKind } from '../../entities/sewing-pricing/sewing-price-calculation';

export interface SewingAmountRange {
  min: number;
  max: number;
}

export interface SewingCardTotals {
  articles: number;
  ready: number;
  /** Minutes per product from the server calculation, the same as in the «Товари» side panel. */
  minutes: number | null;
  /** Labour pay per product (seamstress, cutting, master, manager, bonus), UAH. */
  labour: number | null;
  fullCost: SewingAmountRange | null;
  retail: SewingAmountRange | null;
  wholesale: SewingAmountRange | null;
  largeWholesale: SewingAmountRange | null;
}

export const sewingLabourCostKinds: readonly SewingCostKind[] = [
  'seamstress',
  'cutting',
  'master',
  'manager',
  'bonus',
];

/** Labour pay of one calculated variant, UAH. */
export function sewingLabourCost(row: SewingArticleSummaryRow): number | null {
  return row.calculated
    ? row.costs
        .filter((cost) => sewingLabourCostKinds.includes(cost.kind))
        .reduce((sum, cost) => sum + cost.amount, 0)
    : null;
}

function range(values: number[]): SewingAmountRange | null {
  return values.length ? { min: Math.min(...values), max: Math.max(...values) } : null;
}

/** Figures for the card's metric strip. */
export function sewingCardTotals(rows: readonly SewingArticleSummaryRow[]): SewingCardTotals {
  const ready = rows.filter((row) => row.calculated);
  return {
    articles: rows.length,
    ready: ready.length,
    minutes: ready[0]?.minutes ?? null,
    labour: ready[0] ? sewingLabourCost(ready[0]) : null,
    fullCost: range(ready.flatMap((row) => (row.fullCost === null ? [] : [row.fullCost]))),
    retail: range(ready.flatMap((row) => (row.prices ? [row.prices.retail] : []))),
    wholesale: range(ready.flatMap((row) => (row.prices ? [row.prices.wholesale] : []))),
    largeWholesale: range(ready.flatMap((row) => (row.prices ? [row.prices.largeWholesale] : []))),
  };
}
