import { factsOf, specGroupsOf } from '../../forms/product-pages/content-product-form';
import { blocksFromRichText } from '../../mappers/product-pages/content-rich-text';

import type {
  ContentProductFormValues,
  ContentProductTextValues,
} from '../../forms/product-pages/content-product-form';

/** The same limits the server checks (CNT-002 R-03, R-04). */
export const contentProductLimits = {
  slugMin: 3,
  slugMax: 120,
  name: 200,
  seoTitle: 200,
  seoDescription: 320,
  facts: 20,
  factLabel: 80,
  factText: 1000,
  blocks: 200,
  description: 20_000,
  specGroups: 20,
  specRows: 60,
  specTitle: 120,
  specName: 120,
  specValue: 500,
} as const;

export type ContentProductTextErrors = Partial<Record<keyof ContentProductTextValues, string>>;

export interface ContentProductErrors {
  slug?: string;
  uk?: ContentProductTextErrors;
  ru?: ContentProductTextErrors;
}

export function isValidContentSlug(slug: string): boolean {
  const { slugMin, slugMax } = contentProductLimits;
  if (slug.length < slugMin || slug.length > slugMax) return false;
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

const tooLong = (limit: number) => `Не більше ${limit} символів.`;

function validateText(values: ContentProductTextValues): ContentProductTextErrors {
  const limits = contentProductLimits;
  const errors: ContentProductTextErrors = {};
  if (values.name.trim().length > limits.name) errors.name = tooLong(limits.name);
  if (values.seoTitle.trim().length > limits.seoTitle) errors.seoTitle = tooLong(limits.seoTitle);
  if (values.seoDescription.trim().length > limits.seoDescription)
    errors.seoDescription = tooLong(limits.seoDescription);

  const facts = factsOf(values.summary);
  if (values.summary.some((row) => row.label.trim() && !row.text.trim()))
    errors.summary = 'Заповніть текст у рядку з назвою або видаліть рядок.';
  else if (facts.length > limits.facts) errors.summary = `Не більше ${limits.facts} рядків.`;
  else if (
    facts.some(
      (fact) => (fact.label?.length ?? 0) > limits.factLabel || fact.text.length > limits.factText,
    )
  )
    errors.summary = `Назва до ${limits.factLabel} символів, текст до ${limits.factText}.`;

  const blocks = blocksFromRichText(values.description);
  const length = blocks.reduce(
    (sum, block) =>
      sum +
      (block.text?.length ?? 0) +
      (block.lead?.length ?? 0) +
      block.items.reduce((total, item) => total + item.length, 0),
    0,
  );
  if (blocks.length > limits.blocks) errors.description = `Не більше ${limits.blocks} абзаців.`;
  else if (length > limits.description) errors.description = tooLong(limits.description);

  const groups = specGroupsOf(values.specs);
  const half = values.specs
    .flatMap((group) => group.rows)
    .find((row) => Boolean(row.name.trim()) !== Boolean(row.value.trim()));
  if (half)
    errors.specs = `У рядку «${(half.name || half.value).trim()}» заповніть і назву, і значення.`;
  else if (groups.length > limits.specGroups) errors.specs = `Не більше ${limits.specGroups} груп.`;
  else if (groups.some((group) => group.rows.length > limits.specRows))
    errors.specs = `Не більше ${limits.specRows} рядків у групі.`;
  else if (
    groups.some(
      (group) =>
        (group.title?.length ?? 0) > limits.specTitle ||
        group.rows.some(
          (row) => row.name.length > limits.specName || row.value.length > limits.specValue,
        ),
    )
  )
    errors.specs = `Назва до ${limits.specName} символів, значення до ${limits.specValue}.`;
  return errors;
}

export function validateContentProduct(values: ContentProductFormValues): ContentProductErrors {
  const errors: ContentProductErrors = {};
  const slug = values.slug.trim();
  if (!isValidContentSlug(slug))
    errors.slug = 'Малі латинські літери, цифри та дефіс, від 3 до 120 символів.';
  const uk = validateText(values.uk);
  const ru = validateText(values.ru);
  if (Object.keys(uk).length > 0) errors.uk = uk;
  if (Object.keys(ru).length > 0) errors.ru = ru;
  return errors;
}

export const hasContentProductErrors = (errors: ContentProductErrors) =>
  Object.keys(errors).length > 0;
