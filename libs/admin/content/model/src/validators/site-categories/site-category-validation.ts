import { blocksFromRichText } from '../../mappers/product-pages/content-rich-text';
import { isValidContentSlug } from '../product-pages/content-product-validation';

import type {
  SiteCategoryFormValues,
  SiteCategoryTextValues,
} from '../../forms/site-categories/site-category-form';

/** The same limits the server checks (CNT-003 R-01). */
export const siteCategoryLimits = {
  name: 200,
  seoTitle: 200,
  seoDescription: 320,
  blocks: 200,
  text: 20_000,
} as const;

export type SiteCategoryTextErrors = Partial<Record<keyof SiteCategoryTextValues, string>>;

export interface SiteCategoryErrors {
  slug?: string;
  uk?: SiteCategoryTextErrors;
  ru?: SiteCategoryTextErrors;
}

const tooLong = (limit: number) => `Не більше ${limit} символів.`;

function validateText(values: SiteCategoryTextValues, nameRequired: boolean) {
  const limits = siteCategoryLimits;
  const errors: SiteCategoryTextErrors = {};
  const name = values.name.trim();
  if (nameRequired && !name) errors.name = 'Вкажіть назву українською.';
  else if (name.length > limits.name) errors.name = tooLong(limits.name);
  if (values.seoTitle.trim().length > limits.seoTitle) errors.seoTitle = tooLong(limits.seoTitle);
  if (values.seoDescription.trim().length > limits.seoDescription)
    errors.seoDescription = tooLong(limits.seoDescription);

  const blocks = blocksFromRichText(values.text);
  const length = blocks.reduce(
    (sum, block) =>
      sum +
      (block.text?.length ?? 0) +
      (block.lead?.length ?? 0) +
      block.items.reduce((total, item) => total + item.length, 0),
    0,
  );
  if (blocks.length > limits.blocks) errors.text = `Не більше ${limits.blocks} абзаців.`;
  else if (length > limits.text) errors.text = tooLong(limits.text);
  return errors;
}

/** `isNew` lets the address stay empty: the server builds it from the Ukrainian name. */
export function validateSiteCategory(
  values: SiteCategoryFormValues,
  isNew: boolean,
): SiteCategoryErrors {
  const errors: SiteCategoryErrors = {};
  const slug = values.slug.trim();
  if (!(isNew && !slug) && !isValidContentSlug(slug))
    errors.slug = 'Малі латинські літери, цифри та дефіс, від 3 до 120 символів.';
  const uk = validateText(values.uk, true);
  const ru = validateText(values.ru, false);
  if (Object.keys(uk).length > 0) errors.uk = uk;
  if (Object.keys(ru).length > 0) errors.ru = ru;
  return errors;
}

export const hasSiteCategoryErrors = (errors: SiteCategoryErrors) => Object.keys(errors).length > 0;
