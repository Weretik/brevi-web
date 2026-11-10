import { LOCALES } from '@site/core/i18n';

import { RETURNS_SEO_TEXT, buildReturnsMetadata } from './returns-metadata';

describe('returns metadata', () => {
  it('gives each language its own title, canonical, and alternates', () => {
    const uk = buildReturnsMetadata('uk');
    const ru = buildReturnsMetadata('ru');

    expect(uk.title).toBe(RETURNS_SEO_TEXT.uk.title);
    expect(ru.title).toBe(RETURNS_SEO_TEXT.ru.title);
    expect(uk.alternates?.canonical).toBe('/uk/returns-exchanges');
    expect(ru.alternates?.canonical).toBe('/ru/returns-exchanges');
    expect(uk.alternates?.languages).toMatchObject({
      'uk-UA': '/uk/returns-exchanges',
      'ru-UA': '/ru/returns-exchanges',
    });
  });

  it('keeps titles and descriptions within search snippet length', () => {
    for (const locale of LOCALES) {
      const { title, description } = RETURNS_SEO_TEXT[locale];
      // The layout template adds « — Brevi» (8 characters).
      expect(title.length).toBeLessThanOrEqual(52);
      expect(description.length).toBeGreaterThanOrEqual(110);
      expect(description.length).toBeLessThanOrEqual(165);
    }
  });
});
