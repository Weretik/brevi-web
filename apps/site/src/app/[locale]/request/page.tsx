import { isLocale } from '@site/core/i18n';
import { RequestPage } from '@site/request/feature';
import { buildRequestMetadata } from '@site/request/seo';
import { withSiteSharePicture } from '@site/settings/data-access';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/request'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? withSiteSharePicture(buildRequestMetadata(locale)) : {};
}

export default async function Page({ params }: PageProps<'/[locale]/request'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <RequestPage locale={locale} />;
}
