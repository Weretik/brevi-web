import { CertificatesPage } from '@site/certificates/feature';
import { buildCertificatesMetadata } from '@site/certificates/seo';
import { isLocale } from '@site/core/i18n';
import { sitePageMetadata } from '@site/settings/data-access';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/certificates'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? sitePageMetadata('certificates', locale, buildCertificatesMetadata(locale))
    : {};
}

export default async function Page({ params }: PageProps<'/[locale]/certificates'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <CertificatesPage locale={locale} />;
}
