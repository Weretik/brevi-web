import { articleBodyFromRichText } from '../../mappers/articles/article-rich-text';
import { isValidContentSlug } from '../product-pages/content-product-validation';

import type { ArticleFormValues, ArticleTextValues } from '../../forms/articles/article-form';

/** The same limits the server checks (CNT-004 R-01). */
export const articleLimits = {
  title: 200,
  excerpt: 500,
  seoTitle: 200,
  seoDescription: 320,
  alt: 200,
  blocks: 300,
  text: 60_000,
} as const;

export type ArticleTextErrors = Partial<Record<keyof ArticleTextValues, string>>;

export interface ArticleErrors {
  slug?: string;
  publishedOn?: string;
  uk?: ArticleTextErrors;
  ru?: ArticleTextErrors;
}

const tooLong = (limit: number) => `Не більше ${limit} символів.`;

function validateText(values: ArticleTextValues, titleRequired: boolean) {
  const limits = articleLimits;
  const errors: ArticleTextErrors = {};
  const title = values.title.trim();
  if (titleRequired && !title) errors.title = 'Вкажіть назву українською.';
  else if (title.length > limits.title) errors.title = tooLong(limits.title);
  if (values.excerpt.trim().length > limits.excerpt) errors.excerpt = tooLong(limits.excerpt);
  if (values.seoTitle.trim().length > limits.seoTitle) errors.seoTitle = tooLong(limits.seoTitle);
  if (values.seoDescription.trim().length > limits.seoDescription)
    errors.seoDescription = tooLong(limits.seoDescription);

  const blocks = articleBodyFromRichText(values.body);
  const length = blocks.reduce(
    (sum, block) =>
      sum +
      (block.text?.length ?? 0) +
      (block.lead?.length ?? 0) +
      block.items.reduce((total, item) => total + item.length, 0),
    0,
  );
  if (blocks.length > limits.blocks) errors.body = `Не більше ${limits.blocks} абзаців і фото.`;
  else if (length > limits.text) errors.body = tooLong(limits.text);
  else if (blocks.some((block) => (block.alt?.length ?? 0) > limits.alt))
    errors.body = `Опис фото: не більше ${limits.alt} символів.`;
  return errors;
}

function isValidDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  return year >= 2000 && year <= 2100 && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

/** `isNew` lets the address stay empty: the server builds it from the Ukrainian title. */
export function validateArticle(values: ArticleFormValues, isNew: boolean): ArticleErrors {
  const errors: ArticleErrors = {};
  const slug = values.slug.trim();
  if (!(isNew && !slug) && !isValidContentSlug(slug))
    errors.slug = 'Малі латинські літери, цифри та дефіс, від 3 до 120 символів.';
  if (!isValidDate(values.publishedOn)) errors.publishedOn = 'Вкажіть дату статті.';
  const uk = validateText(values.uk, true);
  const ru = validateText(values.ru, false);
  if (Object.keys(uk).length > 0) errors.uk = uk;
  if (Object.keys(ru).length > 0) errors.ru = ru;
  return errors;
}

export const hasArticleErrors = (errors: ArticleErrors) => Object.keys(errors).length > 0;
