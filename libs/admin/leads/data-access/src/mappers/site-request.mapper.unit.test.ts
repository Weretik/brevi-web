import { describe, expect, it } from 'vitest';

import { mapSiteRequestPage } from './site-request.mapper';

describe('mapSiteRequestPage', () => {
  it('turns missing optional fields into null', () => {
    const page = mapSiteRequestPage({
      items: [
        {
          id: 5,
          phone: '0504698675',
          locale: 'ru',
          status: 'New',
          createdAt: '2026-11-11T10:00:00Z',
          version: 1,
        },
      ],
      total: 1,
      page: 1,
      pageSize: 50,
      counts: { new: 1, inWork: 0, mine: 0, closed: 0 },
    });

    expect(page.items[0]).toMatchObject({
      id: 5,
      locale: 'ru',
      workwear: null,
      fileUrl: null,
      ownerUserId: null,
      notifyError: null,
    });
    expect(page.counts).toEqual({ new: 1, inWork: 0, mine: 0, closed: 0 });
  });
});
