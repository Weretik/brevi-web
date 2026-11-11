import {
  buildCatalogItemListJsonLd,
  buildCatalogProductJsonLd,
  buildCatalogProductMetadata,
  productDescription,
} from './catalog-product-seo';

import type { CatalogProduct } from '@site/catalog/model';

const long = 'Щільна та практична модель для роботи у прохолодну погоду. '.repeat(5).trim();
const product: CatalogProduct = {
  slug: 'flisova-kurtka',
  type: 'Sewing',
  sectionId: 7,
  model: '992',
  name: 'Флісова куртка',
  textLocale: 'uk',
  seo: { title: '', description: '' },
  photos: [{ src: 'https://media.example/flisova-kurtka/1.webp' }],
  summary: [],
  description: [{ type: 'paragraph', text: long }],
  specs: [],
  priceFrom: 900,
  prices: null,
  fabrics: [
    {
      sku: 'MOD-992-1',
      name: 'Фліс',
      details: null,
      prices: { retail: 1100, wholesale: 1000, largeWholesale: 900 },
    },
    { sku: 'MOD-992-2', name: 'Фліс щільний', details: null, prices: null },
  ],
};
const config = {
  siteUrl: 'https://brevi.com.ua',
  environment: 'production',
  indexing: true,
} as never;

describe('catalog product seo', () => {
  it('uses the search description when staff wrote it and the start of the text otherwise', () => {
    expect(
      productDescription({ ...product, seo: { title: '', description: 'Готовий опис.' } }),
    ).toBe('Готовий опис.');
    const cut = productDescription(product);
    expect(cut.length).toBeLessThanOrEqual(160);
    expect(cut.endsWith('…')).toBe(true);
  });

  it('builds the product URL, alternates, and the Open Graph photo', () => {
    const metadata = buildCatalogProductMetadata('uk', product);

    expect(metadata.title).toBe('Флісова куртка');
    expect(metadata.alternates?.canonical).toBe('/uk/product/flisova-kurtka');
    expect(metadata.alternates?.languages).toMatchObject({ 'ru-UA': '/ru/product/flisova-kurtka' });
    expect(JSON.stringify(metadata.openGraph)).toContain(
      'https://media.example/flisova-kurtka/1.webp',
    );
  });

  it('names the Ukrainian page as canonical when the Russian page shows Ukrainian texts', () => {
    const metadata = buildCatalogProductMetadata('ru', product);

    expect(metadata.alternates?.canonical).toBe('/uk/product/flisova-kurtka');
    expect(metadata.alternates?.languages).toBeUndefined();
  });

  it('marks up the product with the price range the page shows', () => {
    const data = buildCatalogProductJsonLd('uk', product, 'Куртки', config) as Record<
      string,
      unknown
    >;

    expect(data['@type']).toBe('Product');
    expect(data.sku).toBe('992');
    expect(data.url).toBe('https://brevi.com.ua/uk/product/flisova-kurtka');
    expect(data.image).toEqual(['https://media.example/flisova-kurtka/1.webp']);
    expect(data.offers).toMatchObject({
      '@type': 'AggregateOffer',
      priceCurrency: 'UAH',
      lowPrice: 900,
      highPrice: 1100,
    });
  });

  it('gives no offer to a product whose price a manager quotes', () => {
    const data = buildCatalogProductJsonLd(
      'uk',
      { ...product, priceFrom: null, fabrics: [] },
      null,
      config,
    ) as Record<string, unknown>;

    expect(data.offers).toBeUndefined();
  });

  it('lists the products of a listing in order with absolute URLs', () => {
    const data = buildCatalogItemListJsonLd(
      [{ name: 'Флісова куртка', path: '/uk/product/flisova-kurtka' }],
      config,
    ) as { itemListElement: { position: number; url: string }[] };

    expect(data.itemListElement).toEqual([
      expect.objectContaining({
        position: 1,
        url: 'https://brevi.com.ua/uk/product/flisova-kurtka',
      }),
    ]);
  });
});
