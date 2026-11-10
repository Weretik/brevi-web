import { LOCALES } from '@site/core/i18n';

import { CONTACTS_SEO_TEXT, buildContactsMetadata } from './contacts-metadata';

describe('contacts metadata', () => {
  it('gives each language its own title, canonical, and alternates', () => {
    const uk = buildContactsMetadata('uk');
    const ru = buildContactsMetadata('ru');

    expect(uk.title).toBe(CONTACTS_SEO_TEXT.uk.title);
    expect(ru.title).toBe(CONTACTS_SEO_TEXT.ru.title);
    expect(uk.alternates?.canonical).toBe('/uk/contacts');
    expect(ru.alternates?.canonical).toBe('/ru/contacts');
    expect(uk.alternates?.languages).toMatchObject({
      'uk-UA': '/uk/contacts',
      'ru-UA': '/ru/contacts',
    });
  });

  it('keeps titles and descriptions within search snippet length', () => {
    for (const locale of LOCALES) {
      const { title, description } = CONTACTS_SEO_TEXT[locale];
      // The layout template adds « — Brevi» (8 characters).
      expect(title.length).toBeLessThanOrEqual(52);
      expect(description.length).toBeGreaterThanOrEqual(110);
      expect(description.length).toBeLessThanOrEqual(165);
    }
  });
});
