import {
  blocksFromRichText,
  blocksToRichText,
} from '../../mappers/product-pages/content-rich-text';

import type {
  ContentLanguage,
  ContentProduct,
  ContentProductFact,
  ContentProductText,
  ContentSpecGroup,
  ContentTextBlock,
} from '../../entities/product-pages/content-product';
import type { ContentRichNode } from '../../mappers/product-pages/content-rich-text';

/** A short fact as a row of two fields; an empty label means a fact without one. */
export interface ContentFactValues {
  label: string;
  text: string;
}

/** A group of characteristics as the editor holds it: a title field and rows of two fields. */
export interface ContentSpecGroupValues {
  title: string;
  rows: { name: string; value: string }[];
}

/**
 * Texts of one language as the editor holds them: the description is a document of the visual editor,
 * facts and characteristics are rows of fields. Nothing is typed as markup.
 */
export interface ContentProductTextValues {
  name: string;
  seoTitle: string;
  seoDescription: string;
  summary: ContentFactValues[];
  description: ContentRichNode;
  specs: ContentSpecGroupValues[];
}

export interface ContentProductFormValues {
  slug: string;
  showOnSite: boolean;
  /** Site categories of the product; null when staff may not see «Розділи сайту», so they stay as they are. */
  categoryIds: number[] | null;
  uk: ContentProductTextValues;
  ru: ContentProductTextValues;
}

export interface ContentProductTextInput {
  name: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  summary: ContentProductFact[];
  description: ContentTextBlock[];
  specs: ContentSpecGroup[];
}

/** Body of the save: the page is replaced as a whole with the revision the editor opened. */
export interface ContentProductInput {
  productId: number;
  revision: number;
  slug: string;
  showOnSite: boolean;
  uk: ContentProductTextInput;
  ru: ContentProductTextInput;
  /** Null keeps the categories of the product. */
  categoryIds: number[] | null;
}

const textValuesOf = (text: ContentProductText): ContentProductTextValues => ({
  name: text.name ?? '',
  seoTitle: text.seoTitle ?? '',
  seoDescription: text.seoDescription ?? '',
  summary: text.summary.map((fact) => ({ label: fact.label ?? '', text: fact.text })),
  description: blocksToRichText(text.description),
  specs: text.specs.map((group) => ({
    title: group.title ?? '',
    rows: group.rows.map((row) => ({ ...row })),
  })),
});

export function contentProductFormOf(product: ContentProduct): ContentProductFormValues {
  return {
    slug: product.slug,
    showOnSite: product.product.showOnSite,
    categoryIds: [...product.categoryIds],
    uk: textValuesOf(product.uk),
    ru: textValuesOf(product.ru),
  };
}

const clean = (value: string) => value.replace(/\s+/g, ' ').trim();

/** Rows left empty are not saved; a fact needs its text. */
export const factsOf = (rows: readonly ContentFactValues[]): ContentProductFact[] =>
  rows.flatMap((row) => {
    const text = clean(row.text);
    return text ? [{ label: clean(row.label).replace(/:$/, '') || null, text }] : [];
  });

/** Rows left empty are not saved, and neither is a group without rows. */
export const specGroupsOf = (groups: readonly ContentSpecGroupValues[]): ContentSpecGroup[] =>
  groups.flatMap((group) => {
    const rows = group.rows
      .map((row) => ({ name: clean(row.name), value: clean(row.value) }))
      .filter((row) => row.name && row.value);
    return rows.length > 0 ? [{ title: clean(group.title) || null, rows }] : [];
  });

export const contentProductTextInputOf = (
  values: ContentProductTextValues,
): ContentProductTextInput => ({
  name: values.name.trim() || null,
  seoTitle: values.seoTitle.trim() || null,
  seoDescription: values.seoDescription.trim() || null,
  summary: factsOf(values.summary),
  description: blocksFromRichText(values.description),
  specs: specGroupsOf(values.specs),
});

export function contentProductInputOf(
  product: ContentProduct,
  values: ContentProductFormValues,
): ContentProductInput {
  return {
    productId: product.product.productId,
    revision: product.revision,
    slug: values.slug.trim(),
    showOnSite: values.showOnSite,
    uk: contentProductTextInputOf(values.uk),
    ru: contentProductTextInputOf(values.ru),
    categoryIds: values.categoryIds,
  };
}

export const contentLanguageLabel = (language: ContentLanguage) =>
  language === 'uk' ? 'Українська' : 'Російська';
