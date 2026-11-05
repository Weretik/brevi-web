import { describe, expect, it } from 'vitest';

import { mapFinanceAttachments } from './accounting-attachment.mapper';

const file = {
  id: '0190a1aa-0000-7000-8000-000000000010',
  transactionId: '0190a1aa-0000-7000-8000-000000000020',
  fileName: 'Рахунок 12.pdf',
  contentType: 'application/pdf',
  sizeBytes: 245_000,
  createdBy: 'director@brevi.com.ua',
  createdAt: '2026-11-05T08:00:00+00:00',
};

describe('accounting attachment mapper', () => {
  it('reads the files of an operation', () => {
    expect(mapFinanceAttachments([file])).toEqual([file]);
  });

  it('rejects a type the server never sends', () => {
    expect(() => mapFinanceAttachments([{ ...file, contentType: 'text/html' }])).toThrow(
      /тип файлу/,
    );
  });
});
