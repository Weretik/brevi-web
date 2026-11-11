import { isLocale } from '@site/core/i18n';
import { RegionsPage } from '@site/regions/feature';
import { buildRegionsMetadata } from '@site/regions/seo';
import { sitePageMetadata } from '@site/settings/data-access';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/regions'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? sitePageMetadata('regions', locale, buildRegionsMetadata(locale)) : {};
}

export default async function Page({ params }: PageProps<'/[locale]/regions'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <RegionsPage locale={locale} />;
}
