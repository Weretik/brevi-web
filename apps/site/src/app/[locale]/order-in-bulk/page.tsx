import { isLocale } from '@site/core/i18n';
import { WholesalePage } from '@site/wholesale/feature';
import { buildWholesaleMetadata } from '@site/wholesale/seo';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/order-in-bulk'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildWholesaleMetadata(locale) : {};
}

export default async function Page({ params }: PageProps<'/[locale]/order-in-bulk'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <WholesalePage locale={locale} />;
}
