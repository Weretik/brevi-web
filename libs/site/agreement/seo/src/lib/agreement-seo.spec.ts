import { LOCALES } from '@site/core/i18n';

import { AGREEMENT_SEO_TEXT, buildAgreementMetadata } from './agreement-metadata';

describe('agreement metadata', () => {
  it('gives each language its own title, canonical, and alternates', () => {
    const uk = buildAgreementMetadata('uk');
    const ru = buildAgreementMetadata('ru');

    expect(uk.title).toBe(AGREEMENT_SEO_TEXT.uk.title);
    expect(ru.title).toBe(AGREEMENT_SEO_TEXT.ru.title);
    expect(uk.alternates?.canonical).toBe('/uk/agreement');
    expect(ru.alternates?.canonical).toBe('/ru/agreement');
    expect(uk.alternates?.languages).toMatchObject({
      'uk-UA': '/uk/agreement',
      'ru-UA': '/ru/agreement',
    });
  });

  it('keeps titles and descriptions within search snippet length', () => {
    for (const locale of LOCALES) {
      const { title, description } = AGREEMENT_SEO_TEXT[locale];
      // The layout template adds « — Brevi» (8 characters).
      expect(title.length).toBeLessThanOrEqual(52);
      expect(description.length).toBeGreaterThanOrEqual(110);
      expect(description.length).toBeLessThanOrEqual(165);
    }
  });
});
