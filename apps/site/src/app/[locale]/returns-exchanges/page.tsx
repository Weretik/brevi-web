import { isLocale } from '@site/core/i18n';
import { ReturnsPage } from '@site/returns/feature';
import { buildReturnsMetadata } from '@site/returns/seo';
import { sitePageMetadata } from '@site/settings/data-access';
import { SitePageTextSection } from '@site/settings/feature';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/returns-exchanges'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? sitePageMetadata('returnsExchanges', locale, buildReturnsMetadata(locale))
    : {};
}

export default async function Page({ params }: PageProps<'/[locale]/returns-exchanges'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <ReturnsPage locale={locale} />
      <SitePageTextSection pageKey="returnsExchanges" locale={locale} />
    </>
  );
}
