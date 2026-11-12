import type { ValuationFabric, ValuationReport } from '../../entities/reports/stock-reports';

/** «Вартість» chips: every fabric, the ones without a price, the shortages. */
export const valuationViews = ['all', 'unpriced', 'shortage'] as const;
export type ValuationView = (typeof valuationViews)[number];

export const valuationViewLabels: Record<ValuationView, string> = {
  all: 'Усі',
  unpriced: 'Без ціни',
  shortage: 'Дефіцит',
};

const isUnpriced = (fabric: ValuationFabric) => fabric.unpricedMeters > 0;

export const valuationViewCounts = (report: ValuationReport): Record<ValuationView, number> => ({
  all: report.fabrics.length,
  unpriced: report.fabrics.filter(isUnpriced).length,
  shortage: report.shortages.length,
});

/** Fabrics of a chip, the most valuable first; unpriced ones by metres after them. */
export function filterValuation(
  fabrics: readonly ValuationFabric[],
  view: Exclude<ValuationView, 'shortage'>,
): ValuationFabric[] {
  return fabrics
    .filter((fabric) => view === 'all' || isUnpriced(fabric))
    .sort(
      (a, b) =>
        b.value - a.value || b.meters - a.meters || a.fabricName.localeCompare(b.fabricName, 'uk'),
    );
}

/** The share of a fabric in the value, 0…1. */
export const valuationShare = (fabric: ValuationFabric, total: number) =>
  total > 0 ? Math.min(1, fabric.value / total) : 0;
