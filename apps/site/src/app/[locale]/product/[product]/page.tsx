import { getCatalogProduct, getCatalogProductSlugs } from '@site/catalog/data-access';
import { CatalogProductPage } from '@site/catalog/feature';
import { buildCatalogProductMetadata } from '@site/catalog/seo';
import { isLocale } from '@site/core/i18n';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

/** Only the products of the catalog exist; any other slug is a real 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getCatalogProductSlugs();
  return slugs.map((product) => ({ product }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/product/[product]'>): Promise<Metadata> {
  const { locale, product: slug } = await params;
  const product = await getCatalogProduct(slug);
  return isLocale(locale) && product ? buildCatalogProductMetadata(locale, product) : {};
}

export default async function Page({ params }: PageProps<'/[locale]/product/[product]'>) {
  const { locale, product: slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!isLocale(locale) || !product) notFound();

  return <CatalogProductPage locale={locale} product={product} />;
}
