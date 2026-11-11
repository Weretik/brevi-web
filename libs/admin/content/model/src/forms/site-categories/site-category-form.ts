import {
  blocksFromRichText,
  blocksToRichText,
  emptyRichText,
} from '../../mappers/product-pages/content-rich-text';

import type { ContentTextBlock } from '../../entities/product-pages/content-product';
import type { SiteCategory, SiteCategoryText } from '../../entities/site-categories/site-category';
import type { ContentRichNode } from '../../mappers/product-pages/content-rich-text';

/** Texts of one language as the editor holds them; the text is a document of the visual editor. */
export interface SiteCategoryTextValues {
  name: string;
  seoTitle: string;
  seoDescription: string;
  text: ContentRichNode;
}

export interface SiteCategoryFormValues {
  /** Null for a category of the top level. */
  parentId: number | null;
  /** May stay empty for a new category: the server builds the address from the Ukrainian name. */
  slug: string;
  showOnSite: boolean;
  uk: SiteCategoryTextValues;
  ru: SiteCategoryTextValues;
}

export interface SiteCategoryTextInput {
  name: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  text: ContentTextBlock[];
}

/** Body of the save: the category is replaced as a whole; `id` null and `revision` 0 create one. */
export interface SiteCategoryInput {
  id: number | null;
  revision: number;
  parentId: number | null;
  slug: string | null;
  showOnSite: boolean;
  uk: SiteCategoryTextInput;
  ru: SiteCategoryTextInput;
}

const textValuesOf = (text: SiteCategoryText): SiteCategoryTextValues => ({
  name: text.name ?? '',
  seoTitle: text.seoTitle ?? '',
  seoDescription: text.seoDescription ?? '',
  text: blocksToRichText(text.text),
});

const emptyText = (): SiteCategoryTextValues => ({
  name: '',
  seoTitle: '',
  seoDescription: '',
  text: emptyRichText,
});

export function siteCategoryFormOf(category: SiteCategory): SiteCategoryFormValues {
  return {
    parentId: category.category.parentId,
    slug: category.category.slug,
    showOnSite: category.category.showOnSite,
    uk: textValuesOf(category.uk),
    ru: textValuesOf(category.ru),
  };
}

/** A new category is hidden until staff switch it on. */
export function newSiteCategoryForm(parentId: number | null): SiteCategoryFormValues {
  return { parentId, slug: '', showOnSite: false, uk: emptyText(), ru: emptyText() };
}

const textInputOf = (values: SiteCategoryTextValues): SiteCategoryTextInput => ({
  name: values.name.trim() || null,
  seoTitle: values.seoTitle.trim() || null,
  seoDescription: values.seoDescription.trim() || null,
  text: blocksFromRichText(values.text),
});

export function siteCategoryInputOf(
  category: SiteCategory | null,
  values: SiteCategoryFormValues,
): SiteCategoryInput {
  return {
    id: category?.category.id ?? null,
    revision: category?.revision ?? 0,
    parentId: values.parentId,
    slug: values.slug.trim() || null,
    showOnSite: values.showOnSite,
    uk: textInputOf(values.uk),
    ru: textInputOf(values.ru),
  };
}
