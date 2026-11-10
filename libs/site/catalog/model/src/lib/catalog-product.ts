import type { CatalogTextBlock } from './catalog-category';
import type { CatalogLocalized } from './catalog-tree';
import type { Locale } from '@site/core/i18n';

export type CatalogPhoto = { src: string; width: number; height: number };

/** A titled group of characteristics, for example «Тканина» with its rows. */
export type CatalogSpecGroup = {
  title: string;
  rows: readonly { name: string; value: string }[];
};

/** A product page. Prices are not part of the snapshot: a manager quotes them on request. */
export type CatalogProduct = {
  slug: string;
  /** The deepest category that lists the product: the parent in the breadcrumbs. */
  categorySlug: string;
  /** Model or article number the manager knows the product by. */
  model: string | null;
  name: CatalogLocalized;
  seo: Record<Locale, { title: string; description: string }>;
  /** Photos in `apps/site/public`, the main one first. */
  photos: readonly CatalogPhoto[];
  /** Short facts next to the photo: who it is for, fabric, features, colors. */
  summary: Record<Locale, readonly CatalogTextBlock[]>;
  description: Record<Locale, readonly CatalogTextBlock[]>;
  specs: Record<Locale, readonly CatalogSpecGroup[]>;
};
