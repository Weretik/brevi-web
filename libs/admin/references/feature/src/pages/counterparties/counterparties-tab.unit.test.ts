import { describe, expect, it } from 'vitest';

import { counterpartiesTabOf } from './counterparties-page';

describe('counterpartiesTabOf', () => {
  it('opens «Рахунки на закупку» only for those who may see it', () => {
    expect(counterpartiesTabOf('purchases', true)).toBe('purchases');
    expect(counterpartiesTabOf('purchases', false)).toBe('suppliers');
    expect(counterpartiesTabOf('purchases')).toBe('suppliers');
  });

  it('keeps clients and falls back to suppliers', () => {
    expect(counterpartiesTabOf('clients')).toBe('clients');
    expect(counterpartiesTabOf(null, true)).toBe('suppliers');
    expect(counterpartiesTabOf('unknown', true)).toBe('suppliers');
  });
});
