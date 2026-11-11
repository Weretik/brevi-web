import { AgreementPage } from '@site/agreement/feature';
import { buildAgreementMetadata } from '@site/agreement/seo';
import { isLocale } from '@site/core/i18n';
import { sitePageMetadata } from '@site/settings/data-access';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/agreement'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? sitePageMetadata('agreement', locale, buildAgreementMetadata(locale))
    : {};
}

export default async function Page({ params }: PageProps<'/[locale]/agreement'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <AgreementPage locale={locale} />;
}
