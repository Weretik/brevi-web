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

  it('builds a flat category URL with the name as the title and a description from it', () => {
    const metadata = buildCatalogCategoryMetadata('ru', {
      slug: 'zhylety',
      name: 'Жилеты',
      seo: { title: '', description: '' },
      textLocale: 'ru',
    });

    expect(metadata.title).toBe('Жилеты');
    expect(metadata.description).toMatch(/^Жилеты от производителя Brevi/);
    expect(metadata.alternates?.canonical).toBe('/ru/catalog/zhylety');
    expect(metadata.alternates?.languages).toMatchObject({ 'uk-UA': '/uk/catalog/zhylety' });
  });

  it('uses the title and description staff wrote for search', () => {
    const metadata = buildCatalogCategoryMetadata('uk', {
      slug: 'zhylety',
      name: 'Жилети',
      seo: { title: 'Купити робочі жилети', description: 'Жилети оптом від виробника.' },
      textLocale: 'uk',
    });

    expect(metadata.title).toBe('Купити робочі жилети');
    expect(metadata.description).toBe('Жилети оптом від виробника.');
  });

  it('names the Ukrainian page as canonical when the Russian page shows Ukrainian texts', () => {
    const metadata = buildCatalogCategoryMetadata('ru', {
      slug: 'zhylety',
      name: 'Жилети',
      seo: { title: '', description: '' },
      textLocale: 'uk',
    });

    expect(metadata.alternates).toEqual({ canonical: '/uk/catalog/zhylety' });
  });
});
