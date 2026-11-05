import { describe, expect, it } from 'vitest';

import { mapPurchaseInvoicePage } from './purchase-invoice.mapper';
import { mapPurchaseInvoiceReview, mapPurchaseSupplierOptions } from './purchase-review.mapper';
import { mapPurchaseSyncState } from './purchase-sync.mapper';

const card = {
  messageId: 'a'.repeat(64),
  telegramKey: '-1001:10',
  sourceUid: '391813611',
  rowNumber: 2,
  sourceRowCount: 1,
  chatName: 'Бреви счета на оплату',
  fromUser: 'Анастасія',
  messageAt: '2026-06-24T13:02:54.000Z',
  text: 'Гідра т.сірий',
  statusOriginal: 'СПЛАЧЕНО',
  markAt: '25.06.2026',
  markBy: 'Юлія',
  markedPaid: true,
  supplierId: 7,
  supplierName: 'Текстиль-Контакт',
  reviewNote: 'Тканина на березень',
  reviewVersion: 2,
  reviewedBy: 'buh@brevi.com.ua',
  reviewedAt: '2026-11-05T08:00:00+00:00',
  state: 'NeedsReview',
  issues: ['Немає посилання на оригінал'],
  links: [
    {
      id: 'f'.repeat(64),
      url: 'https://www.dropbox.com/x.pdf',
      safe: true,
      document: null,
      recognition: {
        result: 'NeedsReview',
        problems: ['Сума позицій 1300.00, а до оплати 1560.00.'],
        model: 'gpt-6.1-terra',
        costUsd: 0.004,
        by: 'buh@brevi.com.ua',
        at: '2026-11-05T08:00:00+00:00',
      },
    },
  ],
};

const document = {
  documentType: 'Рахунок-фактура',
  documentNumber: '110776',
  documentDate: '2026-10-21',
  supplierName: 'ФОП БИСТРОВ ДМИТРО АНДРІЙОВИЧ',
  vat: 'WithoutVat',
  pricesIncludeVat: false,
  vatAmount: null,
  totalPayable: '8000.00',
  items: [
    { position: 1, name: 'Реклама', quantity: '1', unit: 'посл.', price: '8000', sum: '8000.00' },
  ],
  source: 'Manual',
  model: null,
  checkedBy: 'buh@brevi.com.ua',
  checkedAt: '2026-11-05T08:00:00+00:00',
};

describe('purchase invoice responses', () => {
  it('maps a page of cards', () => {
    const page = mapPurchaseInvoicePage({ items: [card], total: 1, page: 1, pageSize: 50 });
    expect(page.items[0]).toEqual(card);
    expect(page.total).toBe(1);
  });

  it('maps the checked facts of a link and refuses an unknown VAT mode', () => {
    const link = { ...card.links[0], document, recognition: null };
    const page = mapPurchaseInvoicePage({
      items: [{ ...card, links: [link] }],
      total: 1,
      page: 1,
      pageSize: 50,
    });
    expect(page.items[0]?.links[0]?.document).toEqual(document);
    expect(() =>
      mapPurchaseInvoicePage({
        items: [{ ...card, links: [{ ...link, document: { ...document, vat: 'unknown' } }] }],
        total: 1,
        page: 1,
        pageSize: 50,
      }),
    ).toThrow('ПДВ');
  });

  it('refuses an unknown state or a missing field', () => {
    expect(() =>
      mapPurchaseInvoicePage({
        items: [{ ...card, state: 'Checked' }],
        total: 1,
        page: 1,
        pageSize: 50,
      }),
    ).toThrow('стан');
    expect(() =>
      mapPurchaseInvoicePage({
        items: [{ ...card, links: undefined }],
        total: 1,
        page: 1,
        pageSize: 50,
      }),
    ).toThrow('посилання');
  });

  it('maps the sync state before the first sync', () => {
    expect(
      mapPurchaseSyncState({
        lastSuccessAt: null,
        lastAttemptAt: null,
        error: null,
        recordCount: 0,
        fileCount: 0,
      }),
    ).toEqual({
      lastSuccessAt: null,
      lastAttemptAt: null,
      error: null,
      recordCount: 0,
      fileCount: 0,
    });
  });
  it('maps a saved review and the supplier options', () => {
    expect(
      mapPurchaseInvoiceReview({
        messageId: 'm1',
        supplierId: null,
        supplierName: null,
        reviewNote: null,
        reviewVersion: 3,
        reviewedBy: 'buh@brevi.com.ua',
        reviewedAt: '2026-11-05T08:00:00Z',
      }).reviewVersion,
    ).toBe(3);
    expect(mapPurchaseSupplierOptions([{ id: 7, name: 'Текстиль-Контакт' }])).toEqual([
      { id: 7, name: 'Текстиль-Контакт' },
    ]);
    expect(() => mapPurchaseSupplierOptions([{ id: 0, name: 'x' }])).toThrow('id постачальника');
  });
});
