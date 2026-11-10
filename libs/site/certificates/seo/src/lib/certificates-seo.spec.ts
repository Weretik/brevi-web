import { LOCALES } from '@site/core/i18n';

import { CERTIFICATES_SEO_TEXT, buildCertificatesMetadata } from './certificates-metadata';

describe('certificates metadata', () => {
  it('gives each language its own title, canonical, and alternates', () => {
    const uk = buildCertificatesMetadata('uk');
    const ru = buildCertificatesMetadata('ru');

    expect(uk.title).toBe(CERTIFICATES_SEO_TEXT.uk.title);
    expect(ru.title).toBe(CERTIFICATES_SEO_TEXT.ru.title);
    expect(uk.alternates?.canonical).toBe('/uk/certificates');
    expect(ru.alternates?.canonical).toBe('/ru/certificates');
    expect(uk.alternates?.languages).toMatchObject({
      'uk-UA': '/uk/certificates',
      'ru-UA': '/ru/certificates',
    });
  });

  it('keeps titles and descriptions within search snippet length', () => {
    for (const locale of LOCALES) {
      const { title, description } = CERTIFICATES_SEO_TEXT[locale];
      // The layout template adds « — Brevi» (8 characters).
      expect(title.length).toBeLessThanOrEqual(52);
      expect(description.length).toBeGreaterThanOrEqual(110);
      expect(description.length).toBeLessThanOrEqual(165);
    }
  });
});
