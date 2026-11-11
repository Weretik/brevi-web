import { describe, expect, it } from 'vitest';

import { contentProductProblems } from './content-product-problems';

import type { ContentProductRow } from '../../entities/product-pages/content-product';

const row = (changes: Partial<ContentProductRow> = {}): ContentProductRow => ({
  productId: 1,
  type: 'Sewing',
  code: 'MOD-001',
  name: 'Костюм Лідер',
  sectionId: 10,
  sectionName: 'Костюми',
  isActive: true,
  mainPhotoUrl: 'https://cdn.test/1.jpg',
  hasPrice: true,
  hasPage: true,
  showOnSite: true,
  onSite: true,
  slug: 'kostyum-lider',
  hasUkrainianText: true,
  hasRussianText: true,
  hasSeo: true,
  updatedAtUtc: null,
  categoryCount: 2,
  ...changes,
});

describe('contentProductProblems', () => {
  it('has nothing to say about a complete page', () => {
    expect(contentProductProblems(row())).toEqual([]);
  });

  it('does not check a product that is not marked for the site', () => {
    expect(
      contentProductProblems(row({ showOnSite: false, hasSeo: false, hasPrice: false })),
    ).toEqual([]);
  });

  it('lists what the site would miss', () => {
    expect(
      contentProductProblems(
        row({
          isActive: false,
          hasPrice: false,
          mainPhotoUrl: null,
          hasRussianText: false,
          categoryCount: 0,
          hasSeo: false,
        }),
      ),
    ).toEqual([
      'Товар вимкнено в «Товари»',
      'Немає ціни',
      'Немає фото',
      'Немає опису російською',
      'Немає розділу сайту',
      'Немає SEO',
    ]);
  });
});
