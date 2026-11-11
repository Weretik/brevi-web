import { contentLanguages } from '../../entities/product-pages/content-product';

import type { ContentLanguage } from '../../entities/product-pages/content-product';
import type { SitePage, SitePageInput } from '../../entities/site-pages/site-page';

/** The limits the server checks (CNT-007 R-01) and the lengths search engines show in full. */
export const sitePageLimits = {
  title: 200,
  description: 320,
  goodTitle: 60,
  goodDescription: 160,
} as const;

export type SitePageFormValues = Record<ContentLanguage, { title: string; description: string }>;

export type SitePageErrors = Partial<
  Record<`${ContentLanguage}.${'title' | 'description'}`, string>
>;

/** One line, as the server keeps it. */
const line = (value: string) => value.split(/\s+/).filter(Boolean).join(' ');

export function sitePageFormOf(page: SitePage): SitePageFormValues {
  return {
    uk: { title: page.texts.uk.title ?? '', description: page.texts.uk.description ?? '' },
    ru: { title: page.texts.ru.title ?? '', description: page.texts.ru.description ?? '' },
  };
}

export function validateSitePage(values: SitePageFormValues): SitePageErrors {
  const errors: SitePageErrors = {};
  for (const language of contentLanguages) {
    if (line(values[language].title).length > sitePageLimits.title)
      errors[`${language}.title`] = `Не довше ${sitePageLimits.title} символів.`;
    if (line(values[language].description).length > sitePageLimits.description)
      errors[`${language}.description`] = `Не довше ${sitePageLimits.description} символів.`;
  }
  return errors;
}

export function sitePageInputOf(page: SitePage, values: SitePageFormValues): SitePageInput {
  const text = (value: string) => line(value) || null;
  return {
    key: page.key,
    revision: page.revision,
    texts: {
      uk: { title: text(values.uk.title), description: text(values.uk.description) },
      ru: { title: text(values.ru.title), description: text(values.ru.description) },
    },
  };
}

/**
 * What a page misses for search: an empty text leaves the site's own text, a long one is cut in the results.
 * Only problems are listed.
 */
export function sitePageProblems(page: SitePage): string[] {
  const problems: string[] = [];
  for (const language of contentLanguages) {
    const name = language === 'uk' ? 'українською' : 'російською';
    const { title, description } = page.texts[language];
    if (!title || !description) problems.push(`Немає заголовка або опису ${name}`);
    else if (
      title.length > sitePageLimits.goodTitle ||
      description.length > sitePageLimits.goodDescription + 10
    )
      problems.push(`Задовгий текст ${name}: у пошуку обріжеться`);
  }
  return problems;
}
