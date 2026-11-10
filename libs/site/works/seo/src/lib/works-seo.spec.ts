import { LOCALES } from '@site/core/i18n';

import { WORKS_SEO_TEXT, buildWorksMetadata } from './works-metadata';

describe('works metadata', () => {
  it('gives each language its own title, canonical, and alternates', () => {
    const uk = buildWorksMetadata('uk');
    const ru = buildWorksMetadata('ru');

    expect(uk.title).toBe(WORKS_SEO_TEXT.uk.title);
    expect(ru.title).toBe(WORKS_SEO_TEXT.ru.title);
    expect(uk.alternates?.canonical).toBe('/uk/our-work');
    expect(ru.alternates?.canonical).toBe('/ru/our-work');
    expect(uk.alternates?.languages).toMatchObject({
      'uk-UA': '/uk/our-work',
      'ru-UA': '/ru/our-work',
    });
  });

  it('keeps titles and descriptions within search snippet length', () => {
    for (const locale of LOCALES) {
      const { title, description } = WORKS_SEO_TEXT[locale];
      // The layout template adds « — Brevi» (8 characters).
      expect(title.length).toBeLessThanOrEqual(52);
      expect(description.length).toBeGreaterThanOrEqual(110);
      expect(description.length).toBeLessThanOrEqual(165);
    }
  });
});
