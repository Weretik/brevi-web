import { LOCALES } from '@site/core/i18n';

import { buildLogoPrintingServiceJsonLd } from './logo-printing-json-ld';
import { LOGO_PRINTING_SEO_TEXT, buildLogoPrintingMetadata } from './logo-printing-metadata';

describe('logo printing metadata', () => {
  it('gives each language its own title, canonical, and alternates', () => {
    const uk = buildLogoPrintingMetadata('uk');
    const ru = buildLogoPrintingMetadata('ru');

    expect(uk.title).toBe(LOGO_PRINTING_SEO_TEXT.uk.title);
    expect(ru.title).toBe(LOGO_PRINTING_SEO_TEXT.ru.title);
    expect(uk.alternates?.canonical).toBe('/uk/logo-printing');
    expect(ru.alternates?.canonical).toBe('/ru/logo-printing');
    expect(uk.alternates?.languages).toMatchObject({
      'uk-UA': '/uk/logo-printing',
      'ru-UA': '/ru/logo-printing',
    });
  });

  it('keeps titles and descriptions within search snippet length', () => {
    for (const locale of LOCALES) {
      const { title, description } = LOGO_PRINTING_SEO_TEXT[locale];
      // The layout template adds « — Brevi» (8 characters).
      expect(title.length).toBeLessThanOrEqual(52);
      expect(description.length).toBeGreaterThanOrEqual(110);
      expect(description.length).toBeLessThanOrEqual(165);
    }
  });

  it('describes the service and points to the organization', () => {
    const data = buildLogoPrintingServiceJsonLd('ru');

    expect(data['@type']).toBe('Service');
    expect(data['url']).toBe('https://brevi.com.ua/ru/logo-printing');
    expect(data['provider']).toEqual({ '@id': 'https://brevi.com.ua/#organization' });
  });
});
