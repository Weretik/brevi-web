import { describe, expect, it } from 'vitest';

import { mapSitePageTexts } from './site-pages-loader';
import { withPageText } from '../metadata/page-text-metadata';

describe('mapSitePageTexts', () => {
  it('keeps the texts by page key', () => {
    expect(
      mapSitePageTexts({
        items: [
          {
            key: 'wholesale',
            uk: {
              title: 'Спецодяг оптом',
              description: ' ',
              text: [
                { kind: 'Heading', text: 'Пошиття' },
                { kind: 'Paragraph', text: 'Шиємо **оптом**', lead: 'Brevi:' },
                { kind: 'List', items: ['Костюми', ' '] },
                { kind: 'Paragraph', text: ' ' },
              ],
              faq: [
                { question: 'Яка партія?', answer: 'Від 5 штук.' },
                { question: 'Без відповіді', answer: ' ' },
              ],
            },
            ru: { title: null, description: null, text: [], faq: [] },
          },
        ],
      }),
    ).toEqual({
      wholesale: {
        uk: {
          title: 'Спецодяг оптом',
          description: null,
          text: [
            { type: 'heading', text: 'Пошиття' },
            { type: 'paragraph', text: 'Шиємо **оптом**', lead: 'Brevi:' },
            { type: 'list', items: ['Костюми'] },
          ],
          faq: [{ question: 'Яка партія?', answer: 'Від 5 штук.' }],
        },
        ru: { title: null, description: null, text: [], faq: [] },
      },
    });
  });

  it('reads an older answer without text and questions as empty', () => {
    expect(
      mapSitePageTexts({ items: [{ key: 'home', uk: { title: 'А' }, ru: { title: null } }] }),
    ).toEqual({
      home: {
        uk: { title: 'А', description: null, text: [], faq: [] },
        ru: { title: null, description: null, text: [], faq: [] },
      },
    });
  });

  it('refuses an answer of another shape', () => {
    expect(() => mapSitePageTexts({ items: [{ key: 1 }] })).toThrow();
    expect(() => mapSitePageTexts(null)).toThrow();
  });
});

describe('withPageText', () => {
  const page = {
    title: 'Свій заголовок',
    description: 'Свій опис',
    openGraph: { title: 'Свій заголовок', description: 'Свій опис', url: '/uk/order-in-bulk' },
  };

  it('puts the saved texts over the page own, also in Open Graph', () => {
    expect(withPageText(page, { title: 'Новий', description: null, text: [], faq: [] })).toEqual({
      title: 'Новий',
      description: 'Свій опис',
      openGraph: { title: 'Новий', description: 'Свій опис', url: '/uk/order-in-bulk' },
    });
  });

  it('keeps the page as it is without saved texts', () => {
    expect(withPageText(page, undefined)).toBe(page);
    expect(withPageText(page, { title: null, description: null, text: [], faq: [] })).toBe(page);
  });
});
