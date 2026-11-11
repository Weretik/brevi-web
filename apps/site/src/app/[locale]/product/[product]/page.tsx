import { getCatalogProduct, getCatalogProductAddresses } from '@site/catalog/data-access';
import { CatalogProductPage } from '@site/catalog/feature';
import { buildCatalogProductMetadata } from '@site/catalog/seo';
import { isLocale } from '@site/core/i18n';
import { redirectOrNotFound } from '@site/redirects/data-access';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

/**
 * Products come from the Admin, so a new one opens without a rebuild: it is rendered on the first visit and
 * kept in the cache. A slug the site does not show is a real 404.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const addresses = await getCatalogProductAddresses();
  return addresses.map((address) => ({ product: address.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/product/[product]'>): Promise<Metadata> {
  const { locale, product: slug } = await params;
  const product = isLocale(locale) ? await getCatalogProduct(slug, locale) : null;
  return isLocale(locale) && product ? buildCatalogProductMetadata(locale, product) : {};
}

export default async function Page({ params }: PageProps<'/[locale]/product/[product]'>) {
  const { locale, product: slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = await getCatalogProduct(slug, locale);
  // A renamed product keeps its old address through «Переадресації».
  if (!product) return redirectOrNotFound(`/${locale}/product/${slug}`);

  return <CatalogProductPage locale={locale} product={product} />;
}
