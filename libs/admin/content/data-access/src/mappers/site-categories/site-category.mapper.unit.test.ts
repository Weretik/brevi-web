import { describe, expect, it } from 'vitest';

import { mapSiteCategory, mapSiteCategoryList } from './site-category.mapper';

const row = {
  id: 2,
  parentId: 1,
  slug: 'kurtky',
  sortOrder: 1,
  showOnSite: true,
  onSite: false,
  nameUk: 'Куртки',
  nameRu: null,
  hasUkrainianText: true,
  hasRussianText: false,
  hasSeo: false,
  productCount: 4,
  updatedAtUtc: '2026-11-11T08:00:00Z',
};

describe('site category mapper', () => {
  it('reads the tree and the editor', () => {
    expect(mapSiteCategoryList({ items: [row] })).toEqual([row]);
    const category = mapSiteCategory({
      category: row,
      revision: 3,
      updatedBy: 'admin@brevi.test',
      uk: {
        name: 'Куртки',
        seoTitle: null,
        seoDescription: null,
        text: [{ kind: 'List', items: ['теплі'] }],
      },
      ru: { name: null, seoTitle: null, seoDescription: null, text: [] },
    });
    expect(category.revision).toBe(3);
    expect(category.uk.text).toEqual([{ kind: 'List', text: null, lead: null, items: ['теплі'] }]);
  });

  it('refuses a response of another shape', () => {
    expect(() => mapSiteCategoryList({ items: [{ ...row, id: 'x' }] })).toThrow();
    expect(() => mapSiteCategory({ category: row, revision: 1, uk: {}, ru: {} })).toThrow();
  });
});
