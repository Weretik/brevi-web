import { describe, expect, it } from 'vitest';

import { moveOrdered, removeOrdered } from './product-order';

describe('product collection order', () => {
  const items = [
    { id: 2, sortOrder: 4 },
    { id: 1, sortOrder: 1 },
    { id: 3, sortOrder: 8 },
  ];

  it('moves by displayed order and writes consecutive sortOrder values', () => {
    expect(moveOrdered(items, 1, 1)).toEqual([
      { id: 1, sortOrder: 0 },
      { id: 3, sortOrder: 1 },
      { id: 2, sortOrder: 2 },
    ]);
  });

  it('renumbers after removal', () => {
    expect(removeOrdered(items, 0)).toEqual([
      { id: 2, sortOrder: 0 },
      { id: 3, sortOrder: 1 },
    ]);
  });
});
