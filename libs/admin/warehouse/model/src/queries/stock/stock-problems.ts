import type { FabricStockColor, FabricStockFabric } from '../../entities/stock/fabric-stock';

/** «Мало»: below this many metres a pair is worth a look. */
export const LOW_STOCK_METERS = 5;

/** The problem chips of «Залишки»; only problems are marked, there is no «все добре». */
export const stockProblems = ['all', 'negative', 'short', 'low'] as const;
export type StockProblem = (typeof stockProblems)[number];

export const stockProblemLabels: Record<StockProblem, string> = {
  all: 'Усі',
  negative: 'Відʼємні',
  short: 'Не вистачає під завдання',
  low: `Мало (менше ${LOW_STOCK_METERS} м)`,
};

/** Whether a pair has the problem: below zero, short for the plans, or under 5 m and not below zero. */
export function hasStockProblem(color: FabricStockColor, problem: StockProblem): boolean {
  switch (problem) {
    case 'negative':
      return color.meters < 0;
    case 'short':
      return color.toOrder > 0;
    case 'low':
      return color.meters >= 0 && color.meters < LOW_STOCK_METERS;
    default:
      return true;
  }
}

/** The pairs of each chip under the supplier filter. */
export function stockProblemCounts(
  fabrics: readonly FabricStockFabric[],
): Record<StockProblem, number> {
  const colors = fabrics.flatMap((x) => x.colors);
  return {
    all: colors.length,
    negative: colors.filter((x) => hasStockProblem(x, 'negative')).length,
    short: colors.filter((x) => hasStockProblem(x, 'short')).length,
    low: colors.filter((x) => hasStockProblem(x, 'low')).length,
  };
}

/** Fabrics of one supplier (null keeps all) with only the pairs that have the problem. */
export function filterFabricStock(
  fabrics: readonly FabricStockFabric[],
  problem: StockProblem,
  supplier: string | null,
): FabricStockFabric[] {
  return fabrics
    .filter((x) => supplier === null || x.supplier === supplier)
    .map((fabric) => {
      if (problem === 'all') return fabric;
      const colors = fabric.colors.filter((x) => hasStockProblem(x, problem));
      return colors.length === fabric.colors.length ? fabric : { ...fabric, colors };
    })
    .filter((x) => x.colors.length > 0);
}

/** Suppliers of the fabrics on the shelf, for the supplier chip. */
export const stockSuppliers = (fabrics: readonly FabricStockFabric[]) =>
  [...new Set(fabrics.map((x) => x.supplier).filter((x): x is string => Boolean(x)))].sort((a, b) =>
    a.localeCompare(b, 'uk'),
  );

export const stockSortKeys = ['name', 'meters', 'booked', 'free'] as const;
export type StockSortKey = (typeof stockSortKeys)[number];

/**
 * «Залишки» sorted by a column, fabrics by their totals and colours inside each; by name A→Я, by metres the largest
 * first unless reversed.
 */
export function sortFabricStock(
  fabrics: readonly FabricStockFabric[],
  key: StockSortKey,
  descending: boolean,
): FabricStockFabric[] {
  const sign = descending ? -1 : 1;
  const byName = (a: string, b: string) => a.localeCompare(b, 'uk') * sign;
  const colors = (fabric: FabricStockFabric) =>
    [...fabric.colors].sort((a, b) =>
      key === 'name' ? byName(a.color, b.color) : (a[key] - b[key]) * sign,
    );
  const total = (fabric: FabricStockFabric, list: FabricStockColor[]) =>
    key === 'name' ? 0 : list.reduce((sum, x) => sum + x[key], 0);
  return fabrics
    .map((fabric) => {
      const sorted = colors(fabric);
      return { fabric: { ...fabric, colors: sorted }, total: total(fabric, sorted) };
    })
    .sort((a, b) =>
      key === 'name'
        ? byName(a.fabric.fabricName, b.fabric.fabricName)
        : (a.total - b.total) * sign,
    )
    .map((x) => x.fabric);
}
