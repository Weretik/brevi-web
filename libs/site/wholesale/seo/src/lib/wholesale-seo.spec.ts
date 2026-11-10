import { LOCALES } from '@site/core/i18n';

import { WHOLESALE_SEO_TEXT, buildWholesaleMetadata } from './wholesale-metadata';

describe('wholesale metadata', () => {
  it('gives each language its own title, canonical, and alternates', () => {
    const uk = buildWholesaleMetadata('uk');
    const ru = buildWholesaleMetadata('ru');

    expect(uk.title).toBe(WHOLESALE_SEO_TEXT.uk.title);
    expect(ru.title).toBe(WHOLESALE_SEO_TEXT.ru.title);
    expect(uk.alternates?.canonical).toBe('/uk/order-in-bulk');
    expect(ru.alternates?.canonical).toBe('/ru/order-in-bulk');
    expect(uk.alternates?.languages).toMatchObject({
      'uk-UA': '/uk/order-in-bulk',
      'ru-UA': '/ru/order-in-bulk',
    });
  });

  it('keeps titles and descriptions within search snippet length', () => {
    for (const locale of LOCALES) {
      const { title, description } = WHOLESALE_SEO_TEXT[locale];
      // The layout template adds « — Brevi» (8 characters).
      expect(title.length).toBeLessThanOrEqual(52);
      expect(description.length).toBeGreaterThanOrEqual(110);
      expect(description.length).toBeLessThanOrEqual(165);
    }
  });
});
