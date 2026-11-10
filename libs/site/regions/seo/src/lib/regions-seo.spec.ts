import { LOCALES } from '@site/core/i18n';

import { REGIONS_SEO_TEXT, buildRegionsMetadata } from './regions-metadata';

describe('regions metadata', () => {
  it('gives each language its own title, canonical, and alternates', () => {
    const uk = buildRegionsMetadata('uk');
    const ru = buildRegionsMetadata('ru');

    expect(uk.title).toBe(REGIONS_SEO_TEXT.uk.title);
    expect(ru.title).toBe(REGIONS_SEO_TEXT.ru.title);
    expect(uk.alternates?.canonical).toBe('/uk/regions');
    expect(ru.alternates?.canonical).toBe('/ru/regions');
    expect(uk.alternates?.languages).toMatchObject({
      'uk-UA': '/uk/regions',
      'ru-UA': '/ru/regions',
    });
  });

  it('keeps titles and descriptions within search snippet length', () => {
    for (const locale of LOCALES) {
      const { title, description } = REGIONS_SEO_TEXT[locale];
      // The layout template adds « — Brevi» (8 characters).
      expect(title.length).toBeLessThanOrEqual(52);
      expect(description.length).toBeGreaterThanOrEqual(110);
      expect(description.length).toBeLessThanOrEqual(165);
    }
  });
});
