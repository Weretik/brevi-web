import { describe, expect, it } from 'vitest';

import {
  mapEmailTemplateDetail,
  mapEmailTemplatePage,
  mapEmailTemplateSettings,
} from './email-template-registry.mapper';

const id = '11111111-1111-1111-1111-111111111111';
const createdAt = '2026-11-01T12:00:00Z';
const detail = {
  versionId: id,
  number: 2,
  name: 'Пропозиція',
  subject: 'КП {quoteNumber}',
  body: 'Вітаємо {recipientName}. {managerName}',
  createdAt,
};
const summary = { versionId: id, number: 2, name: detail.name, subject: detail.subject, createdAt };
const page = (rows: unknown[] = [summary]) => ({
  value: rows,
  pagedInfo: {
    pageNumber: 1,
    pageSize: 25,
    totalRecords: rows.length,
    totalPages: rows.length ? 1 : 0,
  },
});

describe('email template registry response boundary', () => {
  it('keeps immutable subject/body/version and active settings revision in application models', () => {
    expect(mapEmailTemplateDetail(detail)).toEqual({
      id,
      number: 2,
      label: detail.name,
      subject: detail.subject,
      body: detail.body,
      createdAt,
    });
    expect(mapEmailTemplateSettings({ revision: 7, active: detail })).toEqual({
      revision: 7,
      active: mapEmailTemplateDetail(detail),
    });
    expect(mapEmailTemplateSettings({ revision: 1, active: null })).toEqual({
      revision: 1,
      active: null,
    });
  });
  it('maps summaries without inventing body and preserves an empty first page', () => {
    const mapped = mapEmailTemplatePage(page());
    expect(mapped.rows[0]).toEqual({
      id,
      number: 2,
      label: detail.name,
      subject: detail.subject,
      createdAt,
    });
    expect(mapped.rows[0]).not.toHaveProperty('body');
    expect(mapEmailTemplatePage(page([]))).toEqual({
      rows: [],
      page: 1,
      pageSize: 25,
      total: 0,
      totalPages: 0,
    });
  });
  it.each([
    { versionId: 'not-an-id' },
    { number: 0 },
    { name: ' ' },
    { subject: 'Quote\r\nBcc: injected@example.test' },
    { body: '' },
    { body: 'x'.repeat(3001) },
    { createdAt: 'invalid' },
  ])('rejects malformed private detail %#', (patch) => {
    expect(() => mapEmailTemplateDetail({ ...detail, ...patch })).toThrow();
  });
  it('rejects malformed settings, duplicate versions and inconsistent page metadata', () => {
    expect(() => mapEmailTemplateSettings({ revision: 0, active: detail })).toThrow();
    expect(() => mapEmailTemplateSettings({ revision: 1 })).toThrow();
    expect(() => mapEmailTemplatePage(page([summary, summary]))).toThrow();
    expect(() =>
      mapEmailTemplatePage({
        ...page(),
        pagedInfo: { pageNumber: 1, pageSize: 25, totalRecords: 0, totalPages: 0 },
      }),
    ).toThrow();
  });
});
