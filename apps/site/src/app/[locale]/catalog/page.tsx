import { CatalogRootPage } from '@site/catalog/feature';
import { buildCatalogMetadata } from '@site/catalog/seo';
import { isLocale } from '@site/core/i18n';
import { sitePageMetadata } from '@site/settings/data-access';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/catalog'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? sitePageMetadata('catalog', locale, buildCatalogMetadata(locale)) : {};
}

export default async function Page({ params }: PageProps<'/[locale]/catalog'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <CatalogRootPage locale={locale} />;
}
