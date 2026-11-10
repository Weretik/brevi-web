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
  categorySlug: 'reglany-svitera',
  model: '992',
  name: { uk: 'Флісова куртка', ru: 'Флисовая куртка' },
  seo: {
    uk: { title: '', description: '' },
    ru: { title: 'Флисовая куртка оптом', description: 'Готовое описание.' },
  },
  photos: [{ src: '/catalog/products/flisova-kurtka/1.webp', width: 600, height: 800 }],
  summary: { uk: [], ru: [] },
  description: { uk: [{ type: 'paragraph', text: long }], ru: [] },
  specs: { uk: [], ru: [] },
};
const config = {
  siteUrl: 'https://brevi.com.ua',
  environment: 'production',
  indexing: true,
} as never;

describe('catalog product seo', () => {
  it('uses the catalog snippet when it exists and the start of the text otherwise', () => {
    expect(productDescription(product, 'ru')).toBe('Готовое описание.');
    const uk = productDescription(product, 'uk');
    expect(uk.length).toBeLessThanOrEqual(160);
    expect(uk.endsWith('…')).toBe(true);
  });

  it('builds the product URL, alternates, and the Open Graph photo', () => {
    const metadata = buildCatalogProductMetadata('uk', product);

    expect(metadata.title).toBe('Флісова куртка');
    expect(metadata.alternates?.canonical).toBe('/uk/product/flisova-kurtka');
    expect(metadata.alternates?.languages).toMatchObject({ 'ru-UA': '/ru/product/flisova-kurtka' });
    expect(JSON.stringify(metadata.openGraph)).toContain('/catalog/products/flisova-kurtka/1.webp');
  });

  it('marks up the product without an offer', () => {
    const data = buildCatalogProductJsonLd('uk', product, 'Реглани, светри', config) as Record<
      string,
      unknown
    >;

    expect(data['@type']).toBe('Product');
    expect(data.sku).toBe('992');
    expect(data.url).toBe('https://brevi.com.ua/uk/product/flisova-kurtka');
    expect(data.image).toEqual(['https://brevi.com.ua/catalog/products/flisova-kurtka/1.webp']);
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
