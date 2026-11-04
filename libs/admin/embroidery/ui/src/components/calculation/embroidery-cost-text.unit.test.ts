import { describe, expect, it } from 'vitest';

import { embroideryCostBase, embroideryCostShares } from './embroidery-cost-text';

import type { EmbroideryCostRow } from '@admin/embroidery/model';

const row = (patch: Partial<EmbroideryCostRow>): EmbroideryCostRow => ({
  kind: 'Extra',
  name: 'Стаття',
  basis: null,
  quantity: 1,
  rate: 1,
  amount: 0,
  perUnit: 0,
  ...patch,
});

describe('cost row text', () => {
  it('names the base of each row', () => {
    expect(embroideryCostBase(row({ kind: 'Stitches', quantity: 500 }))).toBe('500 × 1000 стежків');
    expect(embroideryCostBase(row({ kind: 'Program', quantity: 60 }))).toBe('1 год');
    expect(embroideryCostBase(row({ kind: 'Program', quantity: 0 }))).toBe('готова');
    expect(embroideryCostBase(row({ basis: 'Order' }))).toBe('раз на замовлення');
  });

  it('splits the cost into shares', () => {
    const rows = [
      row({ kind: 'Stitches', amount: 50 }),
      row({ kind: 'Threads', amount: 25 }),
      row({ kind: 'Extra', amount: 25 }),
    ];
    expect(embroideryCostShares(rows, 100)).toBe(
      'Робота 50% · Нитки і матеріали 25% · Додаткові 25%',
    );
  });
});
