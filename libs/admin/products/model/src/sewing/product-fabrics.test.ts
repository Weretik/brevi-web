import { describe, expect, it } from 'vitest';

import { removeFabric, setPrimaryFabric } from './product-fabrics';

const fabrics = [
  { fabricId: 1, isPrimary: true, sortOrder: 0 },
  { fabricId: 2, isPrimary: false, sortOrder: 1 },
  { fabricId: 3, isPrimary: false, sortOrder: 2 },
];

describe('Sewing fabric selection', () => {
  it('keeps at most two primary fabrics ahead of secondary fabrics', () => {
    const withTwo = setPrimaryFabric(fabrics, 2, true);
    expect(withTwo.map((item) => [item.fabricId, item.isPrimary, item.sortOrder])).toEqual([
      [1, true, 0],
      [3, true, 1],
      [2, false, 2],
    ]);
    expect(setPrimaryFabric(withTwo, 2, true)).toEqual(withTwo);
  });

  it('makes the only remaining fabric primary', () => {
    expect(removeFabric(fabrics.slice(0, 2), 0)).toEqual([
      { fabricId: 2, isPrimary: true, sortOrder: 0 },
    ]);
  });
});
