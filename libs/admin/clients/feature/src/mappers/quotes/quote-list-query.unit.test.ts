import { describe, expect, it } from 'vitest';

import { quoteListQuery } from './quote-list-query';

describe('quote list URL boundary (SC-Q05)', () => {
  it('normalizes invalid URL values and makes the archive route authoritative', () => {
    const params = new URLSearchParams({
      page: '0',
      ownerId: '-1',
      sourceQuoteId: 'bad',
      state: 'unknown',
      createdFrom: 'bad',
      archived: 'false',
    });
    const original = params.toString();
    expect(quoteListQuery(params, true)).toEqual({
      page: 1,
      pageSize: 25,
      search: '',
      state: undefined,
      archived: true,
    });
    expect(params.toString()).toBe(original);
  });
  it('retains owner and source scopes and normalizes date offsets to UTC', () => {
    const source = '11111111-1111-4111-8111-111111111111';
    const params = new URLSearchParams({
      page: '2',
      ownerId: '18',
      sourceQuoteId: source,
      createdFrom: '2026-10-28T09:00:00+02:00',
      createdBefore: '2026-10-29T09:00:00+02:00',
    });
    expect(quoteListQuery(params, false)).toMatchObject({
      page: 2,
      ownerId: 18,
      sourceQuoteId: source,
      createdFrom: '2026-10-28T07:00:00.000Z',
      createdBefore: '2026-10-29T07:00:00.000Z',
    });
  });
});
