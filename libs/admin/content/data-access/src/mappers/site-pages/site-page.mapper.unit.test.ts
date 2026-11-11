import { describe, expect, it } from 'vitest';

import { mapSitePages } from './site-page.mapper';

describe('mapSitePages', () => {
  it('maps the pages with texts in both languages', () => {
    const [page] = mapSitePages({
      items: [
        {
          key: 'home',
          name: 'Головна',
          path: '/',
          titleHasBrand: true,
          uk: { title: 'Пошиття спецодягу — Brevi', description: 'Опис' },
          ru: { title: null, description: null },
          revision: 1,
          updatedAtUtc: '2026-11-11T00:00:00Z',
          updatedBy: 'Тексти сайту',
        },
      ],
    });
    expect(page).toMatchObject({
      key: 'home',
      titleHasBrand: true,
      texts: { uk: { title: 'Пошиття спецодягу — Brevi' }, ru: { title: null } },
    });
  });

  it('refuses an answer of another shape', () => {
    expect(() => mapSitePages({ items: [{ key: 'home' }] })).toThrow();
    expect(() => mapSitePages(null)).toThrow();
  });
});
