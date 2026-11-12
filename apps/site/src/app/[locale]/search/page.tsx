import { CatalogSearchPage } from '@site/catalog/feature';
import { buildCatalogSearchMetadata } from '@site/catalog/seo';
import { isLocale } from '@site/core/i18n';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/search'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildCatalogSearchMetadata(locale) : {};
}

/** Every query is its own answer, so the page renders on each request from the cached catalog. */
export default async function Page({ params, searchParams }: PageProps<'/[locale]/search'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { q } = await searchParams;
  const query = typeof q === 'string' ? q : '';

  return <CatalogSearchPage locale={locale} query={query} />;
}
