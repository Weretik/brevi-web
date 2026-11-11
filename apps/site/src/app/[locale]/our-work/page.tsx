import { isLocale } from '@site/core/i18n';
import { sitePageMetadata } from '@site/settings/data-access';
import { SitePageTextSection } from '@site/settings/feature';
import { WorksPage } from '@site/works/feature';
import { buildWorksMetadata } from '@site/works/seo';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/our-work'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? sitePageMetadata('ourWork', locale, buildWorksMetadata(locale)) : {};
}

export default async function Page({ params }: PageProps<'/[locale]/our-work'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <WorksPage locale={locale} />
      <SitePageTextSection pageKey="ourWork" locale={locale} />
    </>
  );
}
