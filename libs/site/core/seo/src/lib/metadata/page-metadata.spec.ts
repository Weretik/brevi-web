import { createSiteConfig } from '@site/core/config';

import { buildPageMetadata, buildRootMetadata } from './page-metadata';

const production = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
const preview = createSiteConfig({ SITE_ENV: 'preview' });

describe('buildPageMetadata', () => {
  it('links both languages, x-default, and a self canonical', () => {
    const metadata = buildPageMetadata(
      { locale: 'ru', path: '/order-in-bulk', title: 'Опт', description: 'Условия' },
      production,
    );

    expect(metadata.alternates).toEqual({
      canonical: '/ru/order-in-bulk',
      languages: {
        'uk-UA': '/uk/order-in-bulk',
        'ru-UA': '/ru/order-in-bulk',
        'x-default': '/uk/order-in-bulk',
      },
    });
    expect(metadata.openGraph).toMatchObject({
      url: '/ru/order-in-bulk',
      locale: 'ru_UA',
      alternateLocale: ['uk_UA'],
    });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it('keeps a page query in the canonical and alternates', () => {
    const metadata = buildPageMetadata(
      {
        locale: 'uk',
        path: '/catalog/kurtky',
        search: '?page=2',
        title: 'Куртки',
        description: '',
      },
      production,
    );

    expect(metadata.alternates).toEqual({
      canonical: '/uk/catalog/kurtky?page=2',
      languages: {
        'uk-UA': '/uk/catalog/kurtky?page=2',
        'ru-UA': '/ru/catalog/kurtky?page=2',
        'x-default': '/uk/catalog/kurtky?page=2',
      },
    });
  });

  it('uses noindex, follow for non-indexable pages', () => {
    const metadata = buildPageMetadata(
      { locale: 'uk', path: '/request', title: 'Заявка', description: '', indexable: false },
      production,
    );

    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it('blocks indexing everywhere until the site is allowed to be indexed', () => {
    const metadata = buildPageMetadata(
      { locale: 'uk', path: '/', title: 'Головна', description: '' },
      preview,
    );

    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBe('/uk');
  });
});

describe('buildRootMetadata', () => {
  it('sets the absolute URL base and the title template', () => {
    const metadata = buildRootMetadata('uk', production);

    expect(metadata.metadataBase?.toString()).toBe('https://brevi.com.ua/');
    expect(metadata.title).toEqual({ default: 'Brevi', template: '%s — Brevi' });
  });
});
