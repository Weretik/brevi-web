import { describe, expect, it } from 'vitest';

import {
  describePurchaseDocument,
  describePurchaseRecognitionBatch,
  formatPurchaseMessageAt,
  formatPurchaseMoney,
} from './describe-purchase-document';

import type { PurchaseDocument } from '../../entities/invoices/purchase-document';

describe('purchase document text', () => {
  it('shows the sheet time in Kyiv and keeps other text as written', () => {
    expect(formatPurchaseMessageAt('2026-11-04T21:39:54.000Z')).toBe('04.11.26 23:39');
    expect(formatPurchaseMessageAt('04.11.2026 09:00')).toBe('04.11.2026 09:00');
    expect(formatPurchaseMessageAt(null)).toBe('—');
  });

  it('shows the number, the date and money in the Ukrainian way', () => {
    const document = {
      documentType: 'Рахунок-фактура',
      documentNumber: '110776',
      documentDate: '2026-10-21',
    } as PurchaseDocument;
    expect(describePurchaseDocument(document)).toBe('Рахунок-фактура № 110776 від 21.10.2026');
    expect(formatPurchaseMoney('1234567.5')).toBe('1 234 567,50 грн');
    expect(formatPurchaseMoney('8000')).toBe('8 000,00 грн');
  });

  it('describes the batch progress with problems only when there are any', () => {
    expect(
      describePurchaseRecognitionBatch(
        {
          recognized: 4,
          needsReview: 1,
          failed: 0,
          skipped: 0,
          remaining: 0,
          costUsd: 0.0123,
          stopReason: null,
        },
        700,
      ),
    ).toBe('Розпізнано 4 з 700, потребують перевірки 1, витрачено 0.0123 $.');
  });
});
