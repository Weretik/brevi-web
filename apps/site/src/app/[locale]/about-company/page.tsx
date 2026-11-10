import { isLocale } from '@site/core/i18n';
import { ProductionPage } from '@site/production/feature';
import { buildProductionMetadata } from '@site/production/seo';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/about-company'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildProductionMetadata(locale) : {};
}

export default async function Page({ params }: PageProps<'/[locale]/about-company'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <ProductionPage locale={locale} />;
}
