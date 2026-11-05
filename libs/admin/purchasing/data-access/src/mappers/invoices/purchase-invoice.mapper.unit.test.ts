import { describe, expect, it } from 'vitest';

import { mapPurchaseInvoicePage } from './purchase-invoice.mapper';
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
  supplierId: null,
  reviewNote: null,
  reviewVersion: 0,
  state: 'NeedsReview',
  issues: ['Немає посилання на оригінал'],
  links: [{ id: 'f'.repeat(64), url: 'https://www.dropbox.com/x.pdf', safe: true }],
};

describe('purchase invoice responses', () => {
  it('maps a page of cards', () => {
    const page = mapPurchaseInvoicePage({ items: [card], total: 1, page: 1, pageSize: 50 });
    expect(page.items[0]).toEqual(card);
    expect(page.total).toBe(1);
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
});
