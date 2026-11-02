import { describe, expect, it } from 'vitest';

import { listReferenceSuppliers, matchesReferenceSupplier } from './reference-supplier-filter';

describe('reference supplier filter', () => {
  const rows = [{ s: 'Тексика' }, { s: ' Атлас ' }, { s: '' }, { s: 'Атлас' }];

  it('lists suppliers by name with counts and puts rows without a supplier last', () => {
    expect(listReferenceSuppliers(rows, (row) => row.s)).toEqual([
      { value: 'Атлас', count: 2 },
      { value: 'Тексика', count: 1 },
      { value: '', count: 1 },
    ]);
  });

  it('matches every row without a filter and trims names when filtering', () => {
    expect(matchesReferenceSupplier('x', null)).toBe(true);
    expect(matchesReferenceSupplier(' Атлас ', 'Атлас')).toBe(true);
    expect(matchesReferenceSupplier(null, '')).toBe(true);
    expect(matchesReferenceSupplier('Тексика', 'Атлас')).toBe(false);
  });
});
