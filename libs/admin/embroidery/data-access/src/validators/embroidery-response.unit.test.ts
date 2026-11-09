import { describe, expect, it } from 'vitest';

import { ensureEmbroiderySavedPage } from './embroidery-response';

const page = (items: unknown[]) => ({ items, page: 1, pageSize: 20, total: items.length });

describe('ensureEmbroiderySavedPage', () => {
  it('accepts rows with one saved price or none', () => {
    const value = page([
      { id: 1, price: { title: 'Категорія 1', unit: 12, total: 600 } },
      { id: 2, price: null },
    ]);
    expect(ensureEmbroiderySavedPage(value)).toBe(value);
  });

  it('rejects a row whose price is not an object', () => {
    expect(() => ensureEmbroiderySavedPage(page([{ id: 1, price: 5 }]))).toThrow();
  });
});
