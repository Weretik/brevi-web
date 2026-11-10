import { LOCALES } from '@site/core/i18n';

import { DELIVERY_SEO_TEXT, buildDeliveryMetadata } from './delivery-metadata';

describe('delivery metadata', () => {
  it('gives each language its own title, canonical, and alternates', () => {
    const uk = buildDeliveryMetadata('uk');
    const ru = buildDeliveryMetadata('ru');

    expect(uk.title).toBe(DELIVERY_SEO_TEXT.uk.title);
    expect(ru.title).toBe(DELIVERY_SEO_TEXT.ru.title);
    expect(uk.alternates?.canonical).toBe('/uk/delivery-and-payment');
    expect(ru.alternates?.canonical).toBe('/ru/delivery-and-payment');
    expect(uk.alternates?.languages).toMatchObject({
      'uk-UA': '/uk/delivery-and-payment',
      'ru-UA': '/ru/delivery-and-payment',
    });
  });

  it('keeps titles and descriptions within search snippet length', () => {
    for (const locale of LOCALES) {
      const { title, description } = DELIVERY_SEO_TEXT[locale];
      // The layout template adds « — Brevi» (8 characters).
      expect(title.length).toBeLessThanOrEqual(52);
      expect(description.length).toBeGreaterThanOrEqual(110);
      expect(description.length).toBeLessThanOrEqual(165);
    }
  });
});
