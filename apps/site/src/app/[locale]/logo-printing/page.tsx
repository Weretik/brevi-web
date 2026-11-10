import { isLocale } from '@site/core/i18n';
import { LogoPrintingPage } from '@site/logo-printing/feature';
import { buildLogoPrintingMetadata } from '@site/logo-printing/seo';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/logo-printing'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildLogoPrintingMetadata(locale) : {};
}

export default async function Page({ params }: PageProps<'/[locale]/logo-printing'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <LogoPrintingPage locale={locale} />;
}
