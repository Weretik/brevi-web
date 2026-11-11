import { describe, expect, it } from 'vitest';

import { filterSiteCategories, moveSiteCategory, siteCategoryProblems } from './site-category-tree';

import type { SiteCategoryRow } from '../../entities/site-categories/site-category';

const row = (id: number, parentId: number | null, changes: Partial<SiteCategoryRow> = {}) =>
  ({
    id,
    parentId,
    slug: `slug-${id}`,
    sortOrder: id,
    showOnSite: true,
    onSite: true,
    nameUk: `Розділ ${id}`,
    nameRu: `Раздел ${id}`,
    hasUkrainianText: true,
    hasRussianText: true,
    hasSeo: true,
    productCount: 3,
    updatedAtUtc: '2026-11-11T08:00:00Z',
    ...changes,
  }) satisfies SiteCategoryRow;

describe('site category tree', () => {
  it('marks only problems of a category shown on the site', () => {
    const parent = row(1, null, { showOnSite: false, nameUk: 'Спецодяг' });
    expect(siteCategoryProblems(row(2, 1), row(1, null))).toEqual([]);
    expect(siteCategoryProblems(row(2, 1, { showOnSite: false, hasSeo: false }), parent)).toEqual(
      [],
    );
    expect(
      siteCategoryProblems(row(2, 1, { nameRu: null, hasSeo: false, productCount: 0 }), parent),
    ).toEqual([
      'Розділ «Спецодяг» приховано',
      'Немає назви російською',
      'Немає товарів',
      'Немає SEO',
    ]);
  });

  it('keeps the category of a found subcategory', () => {
    const rows = [row(1, null), row(2, 1, { nameUk: 'Куртки' }), row(3, null), row(4, 3)];
    expect(filterSiteCategories(rows, ' курт ').map((item) => item.id)).toEqual([1, 2]);
    expect(filterSiteCategories(rows, 'slug-3').map((item) => item.id)).toEqual([3]);
    expect(filterSiteCategories(rows, '')).toHaveLength(4);
  });

  it('moves a category among its neighbours only', () => {
    const rows = [row(1, null), row(2, 1), row(3, 1), row(4, null)];
    expect(moveSiteCategory(rows, 3, -1)).toEqual({ parentId: 1, ids: [3, 2] });
    expect(moveSiteCategory(rows, 1, 1)).toEqual({ parentId: null, ids: [4, 1] });
    expect(moveSiteCategory(rows, 3, 1)).toBeNull();
    expect(moveSiteCategory(rows, 1, -1)).toBeNull();
  });
});
