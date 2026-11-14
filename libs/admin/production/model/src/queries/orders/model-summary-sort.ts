import type {
  ProductionModelSummaryRow,
  ProductionOrderFilterValues,
} from '../../entities/orders/production-order';

/** Fields of «Зведення за моделями» that «Сортування за пріоритетом» can compare. */
export const modelSummarySortFields = [
  'season',
  'model',
  'category',
  'quantity',
  'ordersCount',
] as const;

export type ModelSummarySortField = (typeof modelSummarySortFields)[number];
export type ModelSummarySortDirection = 'asc' | 'desc';

export interface ModelSummarySortLevel {
  field: ModelSummarySortField;
  direction: ModelSummarySortDirection;
}

export const modelSummarySortFieldLabels: Record<ModelSummarySortField, string> = {
  season: 'Сезон',
  model: 'Модель',
  category: 'Категорія',
  quantity: 'Кількість виробів',
  ordersCount: 'Кількість завдань',
};

/** Season, then model, then category: how the old «Цех» opened the summary. */
export const defaultModelSummarySort: ModelSummarySortLevel[] = [
  { field: 'season', direction: 'asc' },
  { field: 'model', direction: 'asc' },
  { field: 'category', direction: 'asc' },
];

const collator = new Intl.Collator('uk', { numeric: true, sensitivity: 'base' });

function compareField(
  a: ProductionModelSummaryRow,
  b: ProductionModelSummaryRow,
  field: ModelSummarySortField,
): number {
  switch (field) {
    case 'quantity':
    case 'ordersCount':
      return a[field] - b[field];
    case 'model':
      return collator.compare(a.modelCode ?? a.modelName, b.modelCode ?? b.modelName);
    case 'season':
    case 'category': {
      const left = a[field];
      const right = b[field];
      // A row without a value goes last whatever the direction.
      if (!left || !right) return left === right ? 0 : left ? -1 : 1;
      return collator.compare(left, right);
    }
  }
}

/** Compares by the first level, then by the next one on a tie; a field without a value stays last. */
export function sortModelSummary(
  rows: readonly ProductionModelSummaryRow[],
  levels: readonly ModelSummarySortLevel[],
): ProductionModelSummaryRow[] {
  return [...rows].sort((a, b) => {
    for (const level of levels) {
      const empty =
        (level.field === 'season' || level.field === 'category') &&
        (!a[level.field] || !b[level.field]);
      const result = compareField(a, b, level.field);
      if (result !== 0) return empty || level.direction === 'asc' ? result : -result;
    }
    return 0;
  });
}

/** Adds the first field not yet used, or returns the levels unchanged when every field is used. */
export function addModelSummarySortLevel(
  levels: readonly ModelSummarySortLevel[],
): ModelSummarySortLevel[] {
  const free = modelSummarySortFields.find((field) => !levels.some((x) => x.field === field));
  return free ? [...levels, { field: free, direction: 'asc' }] : [...levels];
}

export function moveModelSummarySortLevel(
  levels: readonly ModelSummarySortLevel[],
  index: number,
  offset: -1 | 1,
): ModelSummarySortLevel[] {
  const target = index + offset;
  if (target < 0 || target >= levels.length) return [...levels];
  const next = [...levels];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/** How many «Фільтри» are set. */
export function activeProductionOrderFilters(filters: ProductionOrderFilterValues): number {
  return Object.values(filters).filter((value) => value !== null && value !== '').length;
}
