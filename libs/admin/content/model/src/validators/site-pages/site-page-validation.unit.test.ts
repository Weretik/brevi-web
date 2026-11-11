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
    uk: { title: 'Спецодяг оптом', description: 'Опис' },
    ru: { title: null, description: null },
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
        uk: { title: 'Спецодяг оптом', description: 'Опис' },
        ru: { title: null, description: null },
      },
    });
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
        texts: { uk: page.texts.uk, ru: { title: 'а'.repeat(61), description: 'Опис' } },
      }),
    ).toEqual(['Задовгий текст російською: у пошуку обріжеться']);
  });
});
