import { isLocale } from '@site/core/i18n';
import { sitePageMetadata } from '@site/settings/data-access';
import { SizesPage } from '@site/sizes/feature';
import { buildSizesMetadata } from '@site/sizes/seo';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/size-chart'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? sitePageMetadata('sizeChart', locale, buildSizesMetadata(locale)) : {};
}

export default async function Page({ params }: PageProps<'/[locale]/size-chart'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <SizesPage locale={locale} />;
}
