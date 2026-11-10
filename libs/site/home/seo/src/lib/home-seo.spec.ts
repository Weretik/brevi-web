import { LOCALES } from '@site/core/i18n';

import { HOME_SEO_TEXT, buildHomeMetadata } from './home-metadata';

describe('home metadata', () => {
  it('gives each language its own title, description, canonical, and alternates', () => {
    const uk = buildHomeMetadata('uk');
    const ru = buildHomeMetadata('ru');

    expect(uk.title).toBe(HOME_SEO_TEXT.uk.title);
    expect(ru.title).toBe(HOME_SEO_TEXT.ru.title);
    expect(uk.alternates?.canonical).toBe('/uk');
    expect(ru.alternates?.canonical).toBe('/ru');
    expect(uk.alternates?.languages).toMatchObject({ 'uk-UA': '/uk', 'ru-UA': '/ru' });
  });

  it('keeps titles and descriptions within search snippet length', () => {
    for (const locale of LOCALES) {
      const { title, description } = HOME_SEO_TEXT[locale];
      expect(title.length).toBeLessThanOrEqual(65);
      expect(title).toContain('Brevi');
      expect(description.length).toBeGreaterThanOrEqual(110);
      expect(description.length).toBeLessThanOrEqual(165);
    }
  });
});
