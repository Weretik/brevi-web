import { REQUEST_PRODUCT_PARAM, isLocale } from '@site/core/i18n';
import { RequestPage } from '@site/request/feature';
import { buildRequestMetadata } from '@site/request/seo';
import { sitePageMetadata } from '@site/settings/data-access';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/request'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? sitePageMetadata('request', locale, buildRequestMetadata(locale)) : {};
}

export default async function Page({ params, searchParams }: PageProps<'/[locale]/request'>) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();
  const product = query[REQUEST_PRODUCT_PARAM];

  return (
    <RequestPage locale={locale} product={typeof product === 'string' ? product : undefined} />
  );
}
