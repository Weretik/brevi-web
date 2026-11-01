import { describe, expect, it } from 'vitest';

import { readOccurrenceFilters, writeOccurrenceFilters } from './occurrence-filters';

describe('occurrence filters', () => {
  it('defaults to open periods', () => {
    expect(readOccurrenceFilters(new URLSearchParams('status=x&page=-1&pageSize=7'))).toEqual({
      status: 'open',
      page: 1,
      pageSize: 50,
    });
  });

  it('round-trips valid values', () => {
    const filters = { status: 'done', page: 3, pageSize: 25 } as const;
    expect(readOccurrenceFilters(writeOccurrenceFilters(filters))).toEqual(filters);
  });
});
