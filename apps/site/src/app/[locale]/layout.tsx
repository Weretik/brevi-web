import { getCatalogTree } from '@site/catalog/data-access';
import { toCatalogSections } from '@site/catalog/model';
import { LOCALES, LOCALE_LANGUAGE_TAGS, isLocale } from '@site/core/i18n';
import {
  JsonLd,
  SiteAnalytics,
  buildOrganizationJsonLd,
  buildRootMetadata,
  buildVerificationMetadata,
  withSharePicture,
} from '@site/core/seo';
import { SiteShell } from '@site/core/shell';
import { loadSiteCompany, loadSiteSettings } from '@site/settings/data-access';
import { notFound } from 'next/navigation';

import '../global.css';
import { ibmPlexMono, manrope } from '../fonts';

import type { Metadata, Viewport } from 'next';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  // Verification codes and the sharing picture of «Контент → Налаштування SEO сайту».
  const settings = await loadSiteSettings();
  return {
    ...withSharePicture(buildRootMetadata(locale), settings.sharePicture),
    verification: buildVerificationMetadata(settings),
  };
}

export const viewport: Viewport = { themeColor: '#ffffff' };

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [tree, settings, company] = await Promise.all([
    getCatalogTree(),
    loadSiteSettings(),
    loadSiteCompany(),
  ]);
  const catalogSections = toCatalogSections(tree);

  return (
    <html
      lang={LOCALE_LANGUAGE_TAGS[locale]}
      className={`${manrope.variable} ${ibmPlexMono.variable}`}
    >
      {/* Browser extensions (Grammarly and similar) add attributes to <body> before React hydrates. */}
      <body className="flex min-h-dvh flex-col" suppressHydrationWarning>
        <SiteShell company={company} locale={locale} catalogSections={catalogSections}>
          {children}
        </SiteShell>
        <JsonLd data={buildOrganizationJsonLd(locale, company)} />
        <SiteAnalytics
          googleAnalyticsId={settings.googleAnalyticsId}
          googleTagManagerId={settings.googleTagManagerId}
        />
      </body>
    </html>
  );
}
