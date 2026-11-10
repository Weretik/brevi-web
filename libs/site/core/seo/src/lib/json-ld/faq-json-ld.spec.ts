import { buildFaqPageJsonLd } from './faq-json-ld';

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
