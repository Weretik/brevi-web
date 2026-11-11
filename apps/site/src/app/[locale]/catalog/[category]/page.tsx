import { getCatalogCategory, getCatalogCategorySlugs } from '@site/catalog/data-access';
import { CatalogCategoryPage } from '@site/catalog/feature';
import { buildCatalogCategoryMetadata } from '@site/catalog/seo';
import { isLocale } from '@site/core/i18n';
import { redirectOrNotFound } from '@site/redirects/data-access';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

/**
 * Categories come from the Admin, so a new one opens without a rebuild: it is rendered on the first visit
 * and kept in the cache. A slug the catalog does not have is a real 404.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getCatalogCategorySlugs();
  return slugs.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/catalog/[category]'>): Promise<Metadata> {
  const { locale, category: slug } = await params;
  const category = isLocale(locale) ? await getCatalogCategory(slug, locale) : null;
  return isLocale(locale) && category
    ? buildCatalogCategoryMetadata(locale, {
        slug: category.node.slug,
        name: category.name,
        seo: category.seo,
        textLocale: category.textLocale,
      })
    : {};
}

export default async function Page({ params }: PageProps<'/[locale]/catalog/[category]'>) {
  const { locale, category: slug } = await params;
  if (!isLocale(locale)) notFound();
  const category = await getCatalogCategory(slug, locale);
  if (!category) return redirectOrNotFound(`/${locale}/catalog/${slug}`);

  return <CatalogCategoryPage locale={locale} category={category} />;
}
