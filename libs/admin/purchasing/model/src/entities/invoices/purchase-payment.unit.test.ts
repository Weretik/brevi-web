import { describe, expect, it } from 'vitest';

import { describePurchasePayment, formatPurchaseMinor } from './purchase-payment';

describe('purchase payments', () => {
  it('formats kopecks in hryvnias and keeps other currency codes', () => {
    expect(formatPurchaseMinor(156_000)).toBe('1 560,00 ₴');
    expect(formatPurchaseMinor(5)).toBe('0,05 ₴');
    expect(formatPurchaseMinor(1_234_567_89, 'EUR')).toBe('1 234 567,89 EUR');
  });

  it('describes a payment by date, amount, account and description', () => {
    expect(
      describePurchasePayment({
        date: '2026-11-06',
        amountMinor: 156_000,
        currency: 'UAH',
        accountName: 'Банк',
        description: '',
      }),
    ).toBe('06.11.2026 · 1 560,00 ₴ · Банк');
  });
});
