import {
  blocksFromText,
  blocksToText,
  factsFromText,
  factsToText,
  specsFromText,
  specsToText,
} from '../../mappers/product-pages/content-text-markup';

import type {
  ContentLanguage,
  ContentProduct,
  ContentProductFact,
  ContentProductText,
  ContentSpecGroup,
  ContentTextBlock,
} from '../../entities/product-pages/content-product';

/** Texts of one language as the editor holds them: three plain-text fields with light markup. */
export interface ContentProductTextValues {
  name: string;
  seoTitle: string;
  seoDescription: string;
  summary: string;
  description: string;
  specs: string;
}

export interface ContentProductFormValues {
  slug: string;
  showOnSite: boolean;
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
}

const textValuesOf = (text: ContentProductText): ContentProductTextValues => ({
  name: text.name ?? '',
  seoTitle: text.seoTitle ?? '',
  seoDescription: text.seoDescription ?? '',
  summary: factsToText(text.summary),
  description: blocksToText(text.description),
  specs: specsToText(text.specs),
});

export function contentProductFormOf(product: ContentProduct): ContentProductFormValues {
  return {
    slug: product.slug,
    showOnSite: product.product.showOnSite,
    uk: textValuesOf(product.uk),
    ru: textValuesOf(product.ru),
  };
}

export const contentProductTextInputOf = (
  values: ContentProductTextValues,
): ContentProductTextInput => ({
  name: values.name.trim() || null,
  seoTitle: values.seoTitle.trim() || null,
  seoDescription: values.seoDescription.trim() || null,
  summary: factsFromText(values.summary),
  description: blocksFromText(values.description),
  specs: specsFromText(values.specs),
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
  };
}

export const contentLanguageLabel = (language: ContentLanguage) =>
  language === 'uk' ? 'Українська' : 'Російська';
