import { describe, expect, it } from 'vitest';

import {
  activeProductionOrderFilters,
  addModelSummarySortLevel,
  defaultModelSummarySort,
  moveModelSummarySortLevel,
  sortModelSummary,
} from './model-summary-sort';
import { emptyProductionOrderFilters } from '../entities/production-order';

import type { ProductionModelSummaryRow } from '../entities/production-order';

const row = (
  modelCode: string,
  season: string | null,
  category: string,
  quantity: number,
): ProductionModelSummaryRow => ({
  modelCode,
  modelName: modelCode,
  season,
  category,
  quantity,
  ordersCount: 1,
});

const rows = [
  row('MOD-010', 'Літо', 'Куртка', 5),
  row('MOD-002', 'Зима', 'Куртка', 40),
  row('MOD-001', null, 'Жилет', 7),
  row('MOD-003', 'Зима', 'Жилет', 40),
];

const codes = (list: ProductionModelSummaryRow[]) => list.map((x) => x.modelCode);

describe('sortModelSummary', () => {
  it('compares the next field only on a tie of the previous one', () => {
    expect(codes(sortModelSummary(rows, defaultModelSummarySort))).toEqual([
      'MOD-002',
      'MOD-003',
      'MOD-010',
      'MOD-001',
    ]);
  });

  it('sorts by quantity descending, then category, keeping a row without season last', () => {
    const sorted = sortModelSummary(rows, [
      { field: 'quantity', direction: 'desc' },
      { field: 'category', direction: 'asc' },
    ]);
    expect(codes(sorted)).toEqual(['MOD-003', 'MOD-002', 'MOD-001', 'MOD-010']);
    expect(codes(sortModelSummary(rows, [{ field: 'season', direction: 'desc' }])).at(-1)).toBe(
      'MOD-001',
    );
  });

  it('compares model codes by number', () => {
    expect(codes(sortModelSummary(rows, [{ field: 'model', direction: 'asc' }]))).toEqual([
      'MOD-001',
      'MOD-002',
      'MOD-003',
      'MOD-010',
    ]);
  });
});

describe('sort levels', () => {
  it('adds an unused field and stops when every field is used', () => {
    const four = addModelSummarySortLevel(defaultModelSummarySort);
    expect(four.at(-1)).toEqual({ field: 'quantity', direction: 'asc' });
    const all = addModelSummarySortLevel(four);
    expect(addModelSummarySortLevel(all)).toHaveLength(all.length);
  });

  it('moves a level up and ignores a move past the edge', () => {
    const moved = moveModelSummarySortLevel(defaultModelSummarySort, 1, -1);
    expect(moved.map((x) => x.field)).toEqual(['model', 'season', 'category']);
    expect(moveModelSummarySortLevel(moved, 0, -1)).toEqual(moved);
  });
});

it('counts the set filters', () => {
  expect(
    activeProductionOrderFilters({ ...emptyProductionOrderFilters, client: 'Школа', from: '' }),
  ).toBe(1);
});
