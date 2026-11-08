import { describe, expect, it } from 'vitest';

import { counterpartiesTabOf } from './counterparties-page';

describe('counterpartiesTabOf', () => {
  it('keeps clients and falls back to suppliers', () => {
    expect(counterpartiesTabOf('clients')).toBe('clients');
    expect(counterpartiesTabOf(null)).toBe('suppliers');
    expect(counterpartiesTabOf('purchases')).toBe('suppliers');
  });
});
