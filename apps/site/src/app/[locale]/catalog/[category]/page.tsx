import { getCatalogCategory, getCatalogCategorySlugs } from '@site/catalog/data-access';
import { CatalogCategoryPage } from '@site/catalog/feature';
import { buildCatalogCategoryMetadata } from '@site/catalog/seo';
import { isLocale } from '@site/core/i18n';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

/** Only the categories of the catalog exist; any other slug is a real 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getCatalogCategorySlugs();
  return slugs.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/catalog/[category]'>): Promise<Metadata> {
  const { locale, category: slug } = await params;
  const category = await getCatalogCategory(slug);
  return isLocale(locale) && category
    ? buildCatalogCategoryMetadata(locale, {
        slug: category.slug,
        name: category.name[locale],
        ...category.seo[locale],
      })
    : {};
}

export default async function Page({ params }: PageProps<'/[locale]/catalog/[category]'>) {
  const { locale, category: slug } = await params;
  const category = await getCatalogCategory(slug);
  if (!isLocale(locale) || !category) notFound();

  return <CatalogCategoryPage locale={locale} category={category} />;
}
