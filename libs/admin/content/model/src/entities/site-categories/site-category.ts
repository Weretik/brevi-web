import type { ContentTextBlock } from '../product-pages/content-product';

/** Name, SEO and text of a site category in one language. */
export interface SiteCategoryText {
  name: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  text: ContentTextBlock[];
}

/** A row of «Контент → Розділи»: a category (`parentId` null) or a subcategory of the site catalog. */
export interface SiteCategoryRow {
  id: number;
  parentId: number | null;
  slug: string;
  sortOrder: number;
  showOnSite: boolean;
  /** The mark is set here and on the parent category. */
  onSite: boolean;
  nameUk: string | null;
  nameRu: string | null;
  hasUkrainianText: boolean;
  hasRussianText: boolean;
  hasSeo: boolean;
  /** Products of the category together with its subcategories. */
  productCount: number;
  updatedAtUtc: string;
}

/** The editor of one category. */
export interface SiteCategory {
  category: SiteCategoryRow;
  revision: number;
  updatedBy: string | null;
  uk: SiteCategoryText;
  ru: SiteCategoryText;
}

export interface SiteCategoryVisibility {
  id: number;
  showOnSite: boolean;
  onSite: boolean;
  revision: number;
}

/** What the signed-in staff member may do on «Контент → Розділи» («Права доступу», page `content-categories`). */
export interface SiteCategoriesViewer {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}
