import { describe, expect, it } from 'vitest';

import {
  sitePageFormOf,
  sitePageInputOf,
  sitePageProblems,
  validateSitePage,
} from './site-page-validation';

import type { SitePage } from '../../entities/site-pages/site-page';

const page: SitePage = {
  key: 'wholesale',
  name: 'Оптом',
  path: '/order-in-bulk',
  titleHasBrand: false,
  texts: {
    uk: {
      title: 'Спецодяг оптом',
      description: 'Опис',
      text: [{ kind: 'Paragraph', text: 'Шиємо **оптом**', lead: null, items: [] }],
      faq: [{ question: 'Яка партія?', answer: 'Від 5 штук.' }],
    },
    ru: { title: null, description: null, text: [], faq: [] },
  },
  revision: 1,
  updatedAtUtc: '2026-11-11T00:00:00Z',
  updatedBy: 'Тексти сайту',
};

describe('site page form', () => {
  it('keeps empty texts as null and joins lines', () => {
    const values = sitePageFormOf(page);
    values.uk.title = '  Спецодяг\n оптом ';
    expect(sitePageInputOf(page, values)).toEqual({
      key: 'wholesale',
      revision: 1,
      texts: {
        uk: {
          title: 'Спецодяг оптом',
          description: 'Опис',
          text: [{ kind: 'Paragraph', text: 'Шиємо **оптом**', lead: null, items: [] }],
          faq: [{ question: 'Яка партія?', answer: 'Від 5 штук.' }],
        },
        ru: { title: null, description: null, text: [], faq: [] },
      },
    });
  });

  it('drops empty question rows and trims the others', () => {
    const values = sitePageFormOf(page);
    values.ru.faq = [
      { question: ' Що\n шиєте? ', answer: 'Костюми.' },
      { question: ' ', answer: '' },
    ];
    expect(sitePageInputOf(page, values).texts.ru.faq).toEqual([
      { question: 'Що шиєте?', answer: 'Костюми.' },
    ]);
  });

  it('names a question without its answer and too many questions', () => {
    const values = sitePageFormOf(page);
    values.uk.faq = [...values.uk.faq, { question: 'Ціна?', answer: '' }];
    expect(validateSitePage(values)).toEqual({
      'uk.faq': 'Запитання 2: заповніть і запитання, і відповідь.',
    });
    values.uk.faq = Array.from({ length: 13 }, (_, at) => ({ question: `${at}?`, answer: 'Так.' }));
    expect(validateSitePage(values)).toEqual({ 'uk.faq': 'Не більше 12 запитань.' });
  });

  it('refuses texts longer than the server keeps', () => {
    const values = sitePageFormOf(page);
    values.ru.description = 'а'.repeat(321);
    expect(validateSitePage(values)).toEqual({ 'ru.description': 'Не довше 320 символів.' });
  });

  it('marks only what search engines would miss', () => {
    expect(sitePageProblems(page)).toEqual(['Немає заголовка або опису російською']);
    expect(
      sitePageProblems({
        ...page,
        texts: {
          uk: page.texts.uk,
          ru: { title: 'а'.repeat(61), description: 'Опис', text: [], faq: [] },
        },
      }),
    ).toEqual(['Задовгий текст російською: у пошуку обріжеться']);
  });
});
