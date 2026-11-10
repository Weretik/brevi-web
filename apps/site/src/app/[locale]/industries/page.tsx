import { isLocale } from '@site/core/i18n';
import { IndustriesPage } from '@site/industries/feature';
import { buildIndustriesMetadata } from '@site/industries/seo';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/industries'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildIndustriesMetadata(locale) : {};
}

export default async function Page({ params }: PageProps<'/[locale]/industries'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <IndustriesPage locale={locale} />;
}
