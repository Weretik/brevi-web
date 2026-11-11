import { isLocale } from '@site/core/i18n';
import { DeliveryPage } from '@site/delivery/feature';
import { buildDeliveryMetadata } from '@site/delivery/seo';
import { sitePageMetadata } from '@site/settings/data-access';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/delivery-and-payment'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? sitePageMetadata('deliveryAndPayment', locale, buildDeliveryMetadata(locale))
    : {};
}

export default async function Page({ params }: PageProps<'/[locale]/delivery-and-payment'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <DeliveryPage locale={locale} />;
}
