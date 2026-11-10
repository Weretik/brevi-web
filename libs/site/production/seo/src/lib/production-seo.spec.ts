import { LOCALES } from '@site/core/i18n';

import { PRODUCTION_SEO_TEXT, buildProductionMetadata } from './production-metadata';

describe('production metadata', () => {
  it('gives each language its own title, canonical, and alternates', () => {
    const uk = buildProductionMetadata('uk');
    const ru = buildProductionMetadata('ru');

    expect(uk.title).toBe(PRODUCTION_SEO_TEXT.uk.title);
    expect(ru.title).toBe(PRODUCTION_SEO_TEXT.ru.title);
    expect(uk.alternates?.canonical).toBe('/uk/about-company');
    expect(ru.alternates?.canonical).toBe('/ru/about-company');
    expect(uk.alternates?.languages).toMatchObject({
      'uk-UA': '/uk/about-company',
      'ru-UA': '/ru/about-company',
    });
  });

  it('keeps titles and descriptions within search snippet length', () => {
    for (const locale of LOCALES) {
      const { title, description } = PRODUCTION_SEO_TEXT[locale];
      // The layout template adds « — Brevi» (8 characters).
      expect(title.length).toBeLessThanOrEqual(52);
      expect(title).not.toContain('Brevi');
      expect(description.length).toBeGreaterThanOrEqual(110);
      expect(description.length).toBeLessThanOrEqual(165);
    }
  });
});
