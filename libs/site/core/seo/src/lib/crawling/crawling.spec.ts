import { createSiteConfig } from '@site/core/config';

import { buildRobotsFile } from './robots-file';
import { buildSitemapEntries } from './sitemap-entries';

const production = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
const preview = createSiteConfig({ SITE_ENV: 'preview' });

describe('robots.txt', () => {
  it('disallows everything while indexing is off', () => {
    expect(buildRobotsFile(preview)).toEqual({ rules: { userAgent: '*', disallow: '/' } });
  });

  it('allows the site but not the request pages, the API, or sort URLs once indexing is on', () => {
    const robots = buildRobotsFile(production);

    expect(robots.sitemap).toBe('https://brevi.com.ua/sitemap.xml');
    expect(robots.rules).toMatchObject({
      allow: '/',
      disallow: ['/api/', '/uk/request', '/ru/request', '/*?*sort='],
    });
  });
});

describe('sitemap entries', () => {
  it('lists every language version with alternates', () => {
    const entries = buildSitemapEntries([{ path: '/' }], production);

    expect(entries.map((entry) => entry.url)).toEqual([
      'https://brevi.com.ua/uk',
      'https://brevi.com.ua/ru',
    ]);
    expect(entries[0]?.alternates?.languages).toEqual({
      'uk-UA': 'https://brevi.com.ua/uk',
      'ru-UA': 'https://brevi.com.ua/ru',
    });
  });

  it('lists only the language versions a page has', () => {
    const entries = buildSitemapEntries([{ path: '/product/a', locales: ['uk'] }], production);

    expect(entries.map((entry) => entry.url)).toEqual(['https://brevi.com.ua/uk/product/a']);
    expect(entries[0]?.alternates?.languages).toEqual({
      'uk-UA': 'https://brevi.com.ua/uk/product/a',
    });
  });
});
