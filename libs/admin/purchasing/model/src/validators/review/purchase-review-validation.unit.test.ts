import { describe, expect, it } from 'vitest';

import { validatePurchaseReview } from './purchase-review-validation';
import { purchaseReviewInputOf } from '../../forms/review/purchase-review-form';

import type { PurchaseInvoice } from '../../entities/invoices/purchase-invoice';

describe('purchase review form', () => {
  it('allows a note of 1000 characters and refuses a longer one', () => {
    expect(validatePurchaseReview({ supplierId: 7, note: 'я'.repeat(1000) })).toEqual({});
    expect(validatePurchaseReview({ supplierId: 7, note: 'я'.repeat(1001) }).note).toBe(
      'Примітка — не більше 1000 символів.',
    );
  });

  it('sends the opened version and drops an empty note', () => {
    const invoice = { messageId: 'm1', reviewVersion: 3 } as PurchaseInvoice;
    expect(purchaseReviewInputOf(invoice, { supplierId: null, note: '   ' })).toEqual({
      messageId: 'm1',
      supplierId: null,
      note: null,
      version: 3,
    });
  });
});
