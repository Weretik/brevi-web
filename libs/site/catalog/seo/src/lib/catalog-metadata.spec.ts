import { LOCALES } from '@site/core/i18n';

import {
  CATALOG_SEO_TEXT,
  buildCatalogCategoryMetadata,
  buildCatalogMetadata,
} from './catalog-metadata';

describe('catalog metadata', () => {
  it('gives the catalog root its own title, canonical, and alternates per language', () => {
    const uk = buildCatalogMetadata('uk');

    expect(uk.title).toBe(CATALOG_SEO_TEXT.uk.title);
    expect(uk.alternates?.canonical).toBe('/uk/catalog');
    expect(uk.alternates?.languages).toMatchObject({
      'uk-UA': '/uk/catalog',
      'ru-UA': '/ru/catalog',
    });
  });

  it('keeps the root snippet within search length', () => {
    for (const locale of LOCALES) {
      const { title, description } = CATALOG_SEO_TEXT[locale];
      expect(title.length).toBeLessThanOrEqual(52);
      expect(description.length).toBeGreaterThanOrEqual(110);
      expect(description.length).toBeLessThanOrEqual(165);
    }
  });

  it('builds a flat category URL and falls back to the name without a title', () => {
    const metadata = buildCatalogCategoryMetadata('ru', {
      slug: 'zhylety',
      name: 'Жилеты',
      title: '',
      description: 'Описание',
    });

    expect(metadata.title).toBe('Жилеты');
    expect(metadata.alternates?.canonical).toBe('/ru/catalog/zhylety');
    expect(metadata.alternates?.languages).toMatchObject({ 'uk-UA': '/uk/catalog/zhylety' });
  });
});
