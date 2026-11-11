import { getCatalogTree } from '@site/catalog/data-access';
import { toCatalogSections } from '@site/catalog/model';
import { isLocale } from '@site/core/i18n';
import { HomePage } from '@site/home/feature';
import { buildHomeMetadata } from '@site/home/seo';
import { sitePageMetadata } from '@site/settings/data-access';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? sitePageMetadata('home', locale, buildHomeMetadata(locale)) : {};
}

export default async function Page({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <HomePage locale={locale} catalogSections={toCatalogSections(await getCatalogTree())} />;
}
