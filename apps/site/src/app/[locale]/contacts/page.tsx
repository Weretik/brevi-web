import { ContactsPage } from '@site/contacts/feature';
import { buildContactsMetadata } from '@site/contacts/seo';
import { isLocale } from '@site/core/i18n';
import { sitePageMetadata } from '@site/settings/data-access';
import { SitePageTextSection } from '@site/settings/feature';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/contacts'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? sitePageMetadata('contacts', locale, buildContactsMetadata(locale))
    : {};
}

export default async function Page({ params }: PageProps<'/[locale]/contacts'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <ContactsPage locale={locale} />
      <SitePageTextSection pageKey="contacts" locale={locale} />
    </>
  );
}
