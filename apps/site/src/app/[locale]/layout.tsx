import { getCatalogTree } from '@site/catalog/data-access';
import { toCatalogSections } from '@site/catalog/model';
import { LOCALES, LOCALE_LANGUAGE_TAGS, isLocale } from '@site/core/i18n';
import { JsonLd, buildOrganizationJsonLd, buildRootMetadata } from '@site/core/seo';
import { SiteShell } from '@site/core/shell';
import { notFound } from 'next/navigation';

import '../global.css';
import { ibmPlexMono, manrope } from '../fonts';

import type { Metadata, Viewport } from 'next';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildRootMetadata(locale) : {};
}

export const viewport: Viewport = { themeColor: '#ffffff' };

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const catalogSections = toCatalogSections(await getCatalogTree());

  return (
    <html
      lang={LOCALE_LANGUAGE_TAGS[locale]}
      className={`${manrope.variable} ${ibmPlexMono.variable}`}
    >
      {/* Browser extensions (Grammarly and similar) add attributes to <body> before React hydrates. */}
      <body className="flex min-h-dvh flex-col" suppressHydrationWarning>
        <SiteShell locale={locale} catalogSections={catalogSections}>
          {children}
        </SiteShell>
        <JsonLd data={buildOrganizationJsonLd(locale)} />
      </body>
    </html>
  );
}
