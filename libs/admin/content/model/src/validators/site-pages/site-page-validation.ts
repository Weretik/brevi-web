import { contentLanguages } from '../../entities/product-pages/content-product';
import {
  blocksFromRichText,
  blocksToRichText,
} from '../../mappers/product-pages/content-rich-text';

import type {
  ContentLanguage,
  ContentTextBlock,
} from '../../entities/product-pages/content-product';
import type { SiteFaqItem, SitePage, SitePageInput } from '../../entities/site-pages/site-page';
import type { ContentRichNode } from '../../mappers/product-pages/content-rich-text';

/** The limits the server checks (CNT-007 R-01, CNT-010 R-01) and the lengths search engines show in full. */
export const sitePageLimits = {
  title: 200,
  description: 320,
  goodTitle: 60,
  goodDescription: 160,
  blocks: 200,
  text: 20_000,
  questions: 12,
  question: 200,
  answer: 1_500,
} as const;

export interface SitePageTextValues {
  title: string;
  description: string;
  /** Main text as the visual editor holds it. */
  text: ContentRichNode;
  faq: SiteFaqItem[];
}

export type SitePageFormValues = Record<ContentLanguage, SitePageTextValues>;

export type SitePageErrors = Partial<
  Record<`${ContentLanguage}.${'title' | 'description' | 'text' | 'faq'}`, string>
>;

/** One line, as the server keeps it. */
const line = (value: string) => value.split(/\s+/).filter(Boolean).join(' ');

const textLength = (blocks: readonly ContentTextBlock[]) =>
  blocks.reduce(
    (sum, block) =>
      sum +
      (block.text?.length ?? 0) +
      (block.lead?.length ?? 0) +
      block.items.reduce((total, item) => total + item.length, 0),
    0,
  );

/** Questions as the server keeps them: trimmed, a row with both fields empty left out. */
const filledFaq = (faq: readonly SiteFaqItem[]) =>
  faq
    .map((item) => ({ question: line(item.question), answer: line(item.answer) }))
    .filter((item) => item.question || item.answer);

export function sitePageFormOf(page: SitePage): SitePageFormValues {
  const values = (language: ContentLanguage): SitePageTextValues => {
    const text = page.texts[language];
    return {
      title: text.title ?? '',
      description: text.description ?? '',
      text: blocksToRichText(text.text),
      faq: text.faq.map((item) => ({ ...item })),
    };
  };
  return { uk: values('uk'), ru: values('ru') };
}

export function validateSitePage(values: SitePageFormValues): SitePageErrors {
  const errors: SitePageErrors = {};
  for (const language of contentLanguages) {
    const text = values[language];
    if (line(text.title).length > sitePageLimits.title)
      errors[`${language}.title`] = `Не довше ${sitePageLimits.title} символів.`;
    if (line(text.description).length > sitePageLimits.description)
      errors[`${language}.description`] = `Не довше ${sitePageLimits.description} символів.`;

    const blocks = blocksFromRichText(text.text);
    if (blocks.length > sitePageLimits.blocks)
      errors[`${language}.text`] = `Не більше ${sitePageLimits.blocks} абзаців.`;
    else if (textLength(blocks) > sitePageLimits.text)
      errors[`${language}.text`] = `Не довше ${sitePageLimits.text} символів.`;

    const faq = filledFaq(text.faq);
    const half = faq.findIndex((item) => !item.question || !item.answer);
    const longQuestion = faq.findIndex((item) => item.question.length > sitePageLimits.question);
    const longAnswer = faq.findIndex((item) => item.answer.length > sitePageLimits.answer);
    if (faq.length > sitePageLimits.questions)
      errors[`${language}.faq`] = `Не більше ${sitePageLimits.questions} запитань.`;
    else if (half >= 0)
      errors[`${language}.faq`] = `Запитання ${half + 1}: заповніть і запитання, і відповідь.`;
    else if (longQuestion >= 0)
      errors[`${language}.faq`] =
        `Запитання ${longQuestion + 1}: не довше ${sitePageLimits.question} символів.`;
    else if (longAnswer >= 0)
      errors[`${language}.faq`] =
        `Відповідь ${longAnswer + 1}: не довше ${sitePageLimits.answer} символів.`;
  }
  return errors;
}

export function sitePageInputOf(page: SitePage, values: SitePageFormValues): SitePageInput {
  const input = (language: ContentLanguage) => {
    const text = values[language];
    return {
      title: line(text.title) || null,
      description: line(text.description) || null,
      text: blocksFromRichText(text.text),
      faq: filledFaq(text.faq),
    };
  };
  return { key: page.key, revision: page.revision, texts: { uk: input('uk'), ru: input('ru') } };
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
