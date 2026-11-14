import { SITE_PATHS, catalogCategoryPath, localizedPath } from '@site/core/i18n';
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

const SEARCH_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Пошук по каталогу',
    description:
      'Пошук спецодягу та засобів захисту Brevi за назвою моделі, її номером або видом виробу.',
  },
  ru: {
    title: 'Поиск по каталогу',
    description:
      'Поиск спецодежды и средств защиты Brevi по названию модели, её номеру или виду изделия.',
  },
};

/** Search results are a utility page: `noindex, follow`, out of the sitemap, one canonical without a query. */
export function buildCatalogSearchMetadata(locale: Locale): Metadata {
  return buildPageMetadata({
    locale,
    path: SITE_PATHS.search,
    indexable: false,
    ...SEARCH_SEO_TEXT[locale],
  });
}

export type CatalogCategorySeoInput = {
  slug: string;
  /** Category name in the page language. */
  name: string;
  /** Title and description staff wrote for search; empty strings when they did not. */
  seo: { title: string; description: string };
  /** Language of the texts that came back. */
  textLocale: Locale;
};

const CATEGORY_DESCRIPTION: Record<Locale, (name: string) => string> = {
  uk: (name) =>
    `${name} від виробника Brevi: моделі з фото, характеристиками та цінами. Замовлення від 5 виробів, ціна залежить від кількості, доставка по Україні.`,
  ru: (name) =>
    `${name} от производителя Brevi: модели с фото, характеристиками и ценами. Заказ от 5 изделий, цена зависит от количества, доставка по Украине.`,
};

/**
 * Metadata of a category page: the title and description staff wrote in «Контент → Розділи сайту», or the
 * name and a description built from it. A category without Russian texts shows the Ukrainian ones on the
 * Russian page, so that page names the Ukrainian one as canonical and has no language alternates.
 */
export function buildCatalogCategoryMetadata(
  locale: Locale,
  category: CatalogCategorySeoInput,
): Metadata {
  const path = catalogCategoryPath(category.slug);
  const page = buildPageMetadata({
    locale,
    path,
    title: category.seo.title || category.name,
    description: category.seo.description || CATEGORY_DESCRIPTION[locale](category.name),
  });
  if (category.textLocale === locale) return page;
  const original = localizedPath(category.textLocale, path);
  return {
    ...page,
    alternates: { canonical: original },
    openGraph: { ...page.openGraph, url: original },
  };
}
