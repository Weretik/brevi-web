import type { CatalogTextBlock } from './catalog-category';
import type { CatalogProductType } from './catalog-tree';
import type { Locale } from '@site/core/i18n';

export type CatalogPhoto = { src: string };

/** A titled group of characteristics, for example «Куртка» with its rows. */
export type CatalogSpecGroup = {
  title: string | null;
  rows: readonly { name: string; value: string }[];
};

/** Prices in hryvnias by order size: 1–9, 10–40, and from 41 pieces. */
export type CatalogPriceTiers = { retail: number; wholesale: number; largeWholesale: number };

/** A fabric a sewing model is made of, with its own prices; `null` prices mean a manager quotes them. */
export type CatalogFabric = {
  sku: string;
  name: string;
  /** Composition and density in words. */
  details: string | null;
  prices: CatalogPriceTiers | null;
};

/** A category of a product with its top-level category, in the language of the page. */
export type CatalogProductCategory = {
  slug: string;
  name: string;
  parent: { slug: string; name: string } | null;
};

/** A product page in the language of the page. */
export type CatalogProduct = {
  slug: string;
  type: CatalogProductType;
  /** Site categories the product is in, in menu order; empty when staff put it in none. */
  categories: readonly CatalogProductCategory[];
  /** Model or article number the manager knows the product by. */
  model: string | null;
  name: string;
  /** Language of the texts: a product without Russian texts shows the Ukrainian ones on the Russian page. */
  textLocale: Locale;
  seo: { title: string; description: string };
  /** Photos on the media server, the main one first. */
  photos: readonly CatalogPhoto[];
  /** Short facts next to the photo: who it is for, season, features. */
  summary: readonly CatalogTextBlock[];
  description: readonly CatalogTextBlock[];
  specs: readonly CatalogSpecGroup[];
  /** The lowest price among the fabrics, or the price of a product without fabrics. */
  priceFrom: number | null;
  /** Prices of a product without fabrics (protective equipment). */
  prices: CatalogPriceTiers | null;
  /** Fabrics of a sewing model; empty for protective equipment. */
  fabrics: readonly CatalogFabric[];
};

/** An address of a product or of a category for the sitemap. */
export type CatalogProductAddress = {
  slug: string;
  updatedAt: string;
  /** False when the Russian page shows the Ukrainian texts. */
  hasRussian: boolean;
};
