import { SITE_PATHS, catalogCategoryPath } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Title and description of the catalog root; the layout template adds « — Brevi» to the title. */
export const CATALOG_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Каталог спецодягу та засобів захисту',
    description:
      'Каталог Brevi: спецодяг власного пошиття і засоби індивідуального захисту з цінами. Замовлення від 5 виробів, доставка по Україні.',
  },
  ru: {
    title: 'Каталог спецодежды и средств защиты',
    description:
      'Каталог Brevi: спецодежда собственного пошива и средства индивидуальной защиты с ценами. Заказ от 5 изделий, доставка по Украине.',
  },
};

export function buildCatalogMetadata(locale: Locale): Metadata {
  return buildPageMetadata({ locale, path: SITE_PATHS.catalog, ...CATALOG_SEO_TEXT[locale] });
}

export type CatalogCategorySeoInput = {
  slug: string;
  /** Category name in the page language. */
  name: string;
};

const CATEGORY_DESCRIPTION: Record<Locale, (name: string) => string> = {
  uk: (name) =>
    `${name} від виробника Brevi: моделі з фото, характеристиками та цінами. Замовлення від 5 виробів, ціна залежить від кількості, доставка по Україні.`,
  ru: (name) =>
    `${name} от производителя Brevi: модели с фото, характеристиками и ценами. Заказ от 5 изделий, цена зависит от количества, доставка по Украине.`,
};

/**
 * Metadata of a category page. The Admin keeps only the name of a section, so the title is the name and the
 * description is built from it; texts written by staff come with «Контент → Розділи».
 */
export function buildCatalogCategoryMetadata(
  locale: Locale,
  category: CatalogCategorySeoInput,
): Metadata {
  return buildPageMetadata({
    locale,
    path: catalogCategoryPath(category.slug),
    title: category.name,
    description: CATEGORY_DESCRIPTION[locale](category.name),
  });
}
