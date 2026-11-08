import { describe, expect, it } from 'vitest';

import {
  mapPurchaseInvoicePayments,
  mapPurchasePaymentCandidates,
} from './purchase-payment.mapper';

describe('purchase payment responses', () => {
  it('maps the payments after a change, a missing operation with empty fields', () => {
    const missing = {
      transactionId: 't9',
      date: null,
      amountMinor: null,
      currency: null,
      accountName: null,
      description: null,
      counterpartyName: null,
      missing: true,
      voided: false,
      linkedBy: 'director@brevi.com.ua',
      linkedAt: '2026-11-08T10:00:00+00:00',
    };
    const answer = {
      messageId: 'm1',
      reviewVersion: 4,
      totalPayableMinor: null,
      payments: [missing],
      paymentIssues: ['Операцію оплати не знайдено в «Бухгалтерії».'],
    };
    expect(mapPurchaseInvoicePayments(answer)).toEqual(answer);
    expect(() => mapPurchaseInvoicePayments({ ...answer, reviewVersion: 'x' })).toThrow('версія');
  });

  it('maps the offered expenses and refuses one without an amount', () => {
    const candidate = {
      transactionId: 't1',
      date: '2026-11-06',
      amountMinor: 156_000,
      currency: 'UAH',
      accountName: 'Банк',
      description: 'Оплата рахунку 15',
      counterpartyName: null,
      sameAmount: true,
    };
    expect(mapPurchasePaymentCandidates([candidate])).toEqual([candidate]);
    expect(() => mapPurchasePaymentCandidates([{ ...candidate, amountMinor: null }])).toThrow(
      'сума',
    );
  });
});
