import { LOCALES } from '@site/core/i18n';

import { INDUSTRIES_SEO_TEXT, buildIndustriesMetadata } from './industries-metadata';

describe('industries metadata', () => {
  it('gives each language its own title, canonical, and alternates', () => {
    const uk = buildIndustriesMetadata('uk');
    const ru = buildIndustriesMetadata('ru');

    expect(uk.title).toBe(INDUSTRIES_SEO_TEXT.uk.title);
    expect(ru.title).toBe(INDUSTRIES_SEO_TEXT.ru.title);
    expect(uk.alternates?.canonical).toBe('/uk/industries');
    expect(ru.alternates?.canonical).toBe('/ru/industries');
    expect(uk.alternates?.languages).toMatchObject({
      'uk-UA': '/uk/industries',
      'ru-UA': '/ru/industries',
    });
  });

  it('keeps titles and descriptions within search snippet length', () => {
    for (const locale of LOCALES) {
      const { title, description } = INDUSTRIES_SEO_TEXT[locale];
      // The layout template adds « — Brevi» (8 characters).
      expect(title.length).toBeLessThanOrEqual(52);
      expect(description.length).toBeGreaterThanOrEqual(110);
      expect(description.length).toBeLessThanOrEqual(165);
    }
  });
});
