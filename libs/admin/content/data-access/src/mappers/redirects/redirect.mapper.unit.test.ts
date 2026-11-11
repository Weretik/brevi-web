import { describe, expect, it } from 'vitest';

import { mapRedirectImportReport, mapRedirectList } from './redirect.mapper';

describe('redirect mapper', () => {
  it('maps the list', () => {
    const list = mapRedirectList({
      items: [
        {
          id: 3,
          fromPath: '/kostyum-lider',
          toPath: '/uk/product/kostyum-lider',
          source: 'OldSite',
          note: null,
          updatedAtUtc: '2026-11-11T08:00:00Z',
          updatedBy: 'admin@brevi.test',
        },
      ],
    });
    expect(list[0]).toMatchObject({ id: 3, source: 'OldSite', note: null });
  });

  it('refuses an unknown source', () => {
    expect(() =>
      mapRedirectList({
        items: [
          {
            id: 1,
            fromPath: '/a',
            toPath: '/uk',
            source: 'X',
            updatedAtUtc: '2026-11-11T08:00:00Z',
            updatedBy: '',
          },
        ],
      }),
    ).toThrow();
  });

  it('maps the transfer report', () => {
    const report = mapRedirectImportReport({
      dryRun: true,
      total: 2,
      created: 1,
      updated: 0,
      kept: 0,
      unresolved: 1,
      rows: [
        { fromPath: '/a', toPath: '/uk/a', note: 'Розділ', result: 'Created' },
        { fromPath: '/b', toPath: null, note: 'Не знайдено', result: 'Unresolved' },
      ],
    });
    expect(report.rows[1]).toEqual({
      fromPath: '/b',
      toPath: null,
      note: 'Не знайдено',
      result: 'Unresolved',
    });
  });
});
