import { LOCALES } from '@site/core/i18n';

import { buildFaqPageJsonLd } from './faq-json-ld';
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

describe('FAQ structured data', () => {
  it('maps the visible questions into FAQPage in order', () => {
    const data = buildFaqPageJsonLd([
      { question: 'Яка мінімальна партія?', answer: 'Від 5 штук.' },
      { question: 'Які терміни?', answer: 'Від 20 днів.' },
    ]);

    expect(data['@type']).toBe('FAQPage');
    expect(data['mainEntity']).toEqual([
      {
        '@type': 'Question',
        name: 'Яка мінімальна партія?',
        acceptedAnswer: { '@type': 'Answer', text: 'Від 5 штук.' },
      },
      {
        '@type': 'Question',
        name: 'Які терміни?',
        acceptedAnswer: { '@type': 'Answer', text: 'Від 20 днів.' },
      },
    ]);
  });
});
