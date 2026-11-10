import { SITE_PATHS, catalogCategoryPath } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Title and description of the catalog root; the layout template adds « — Brevi» to the title. */
export const CATALOG_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Каталог спецодягу та засобів захисту',
    description:
      'Каталог Brevi: літній і зимовий спецодяг власного пошиття, робоче взуття, захист рук, очей і дихання. Замовлення від 5 виробів, доставка по Україні.',
  },
  ru: {
    title: 'Каталог спецодежды и средств защиты',
    description:
      'Каталог Brevi: летняя и зимняя спецодежда собственного пошива, рабочая обувь, защита рук, глаз и дыхания. Заказ от 5 изделий, доставка по Украине.',
  },
};

export function buildCatalogMetadata(locale: Locale): Metadata {
  return buildPageMetadata({ locale, path: SITE_PATHS.catalog, ...CATALOG_SEO_TEXT[locale] });
}

export type CatalogCategorySeoInput = {
  slug: string;
  /** Category name: the fallback when the catalog data has no title. */
  name: string;
  title: string;
  description: string;
};

/** Metadata of a category page: the title and description come from the catalog data. */
export function buildCatalogCategoryMetadata(
  locale: Locale,
  category: CatalogCategorySeoInput,
): Metadata {
  return buildPageMetadata({
    locale,
    path: catalogCategoryPath(category.slug),
    title: category.title || category.name,
    description: category.description,
  });
}
