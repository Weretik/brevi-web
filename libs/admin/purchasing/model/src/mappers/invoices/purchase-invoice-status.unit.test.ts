import { describe, expect, it } from 'vitest';

import { purchaseInvoiceStatus, purchaseLineDiscount } from './purchase-invoice-status';

import type {
  PurchaseInvoice,
  PurchaseInvoiceLink,
} from '../../entities/invoices/purchase-invoice';

const document = {
  documentType: 'Рахунок',
  documentNumber: '1542',
  documentDate: '2026-11-03',
  supplierName: 'ТОВ Захист-Про',
  vat: 'WithoutVat' as const,
  pricesIncludeVat: false,
  vatAmount: null,
  totalPayable: '453.15',
  items: [],
  source: 'Ai' as const,
  model: 'gpt-6-luna',
  checkedBy: 'buh@brevi.com.ua',
  checkedAt: '2026-11-05T08:00:00Z',
};
const link = (value: Partial<PurchaseInvoiceLink>): PurchaseInvoiceLink => ({
  id: 'f1',
  url: 'https://www.dropbox.com/s/a.pdf',
  safe: true,
  document: null,
  recognition: null,
  ...value,
});
const invoice = (links: PurchaseInvoiceLink[], value: Partial<PurchaseInvoice> = {}) =>
  ({ links, issues: [], supplierId: null, supplierName: null, ...value }) as PurchaseInvoice;
const failed = {
  result: 'NeedsReview' as const,
  problems: ['Сума позицій 7900.00, а до оплати 8000.00.'],
  model: 'gpt-6.1-terra',
  costUsd: 0.01,
  by: 'buh@brevi.com.ua',
  at: '2026-11-05T08:00:00Z',
};

describe('purchase invoice status', () => {
  it('gives each of the four marks', () => {
    expect(purchaseInvoiceStatus(invoice([link({ document })])).status).toBe('Recognized');
    expect(purchaseInvoiceStatus(invoice([link({})])).status).toBe('NotRecognized');
    expect(purchaseInvoiceStatus(invoice([link({ recognition: failed })]))).toEqual({
      status: 'Error',
      notes: ['Сума позицій 7900.00, а до оплати 8000.00.'],
    });
    expect(
      purchaseInvoiceStatus(invoice([link({ document })], { issues: ['Порожній текст'] })),
    ).toEqual({ status: 'Warning', notes: ['Порожній текст'] });
  });

  it('puts an error before a file not read yet and drops copies of recognition problems', () => {
    const value = invoice([link({ recognition: failed }), link({ id: 'f2' })], {
      issues: ['file_1.pdf: Сума позицій 7900.00, а до оплати 8000.00.'],
    });
    expect(purchaseInvoiceStatus(value)).toEqual({
      status: 'Error',
      notes: ['Сума позицій 7900.00, а до оплати 8000.00.'],
    });
  });

  it('reads a discounted line', () => {
    expect(purchaseLineDiscount({ quantity: '10', price: '47.70', sum: '453.15' })).toBe(5);
    expect(purchaseLineDiscount({ quantity: '3', price: '2666.67', sum: '8000.00' })).toBeNull();
  });
});
