import { describe, expect, it } from 'vitest';

import { fromSortModel, toSortModel } from './production-orders-sort';

describe('production orders sort', () => {
  it('shows a descending server sort on its column', () => {
    expect(toSortModel('-due')).toEqual([{ field: 'nearestDueDate', sort: 'desc' }]);
    expect(toSortModel('created')).toEqual([{ field: 'orderDate', sort: 'asc' }]);
    expect(toSortModel(undefined)).toEqual([]);
  });

  it('turns a column sort into the server sort, newest numbers first without one', () => {
    expect(fromSortModel([{ field: 'number', sort: 'asc' }])).toBe('number');
    expect(fromSortModel([{ field: 'nearestDueDate', sort: 'desc' }])).toBe('-due');
    expect(fromSortModel([])).toBe('-number');
    expect(fromSortModel([{ field: 'clientName', sort: 'asc' }])).toBe('-number');
  });
});
