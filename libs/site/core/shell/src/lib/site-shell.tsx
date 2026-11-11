import { SiteFooter } from './footer/site-footer';
import { SiteHeader } from './header/site-header';
import { getShellDictionary } from './i18n/shell-dictionary';
import { MobileBar } from './mobile/mobile-bar';

import type { CatalogSection } from '@site/catalog/model';
import type { Company } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { ReactNode } from 'react';

/**
 * Page frame for every localized route: skip link, two-row header, main content, footer, and the bottom bar
 * on phones. The catalog sections come from the layout, which reads them on the server.
 */
export function SiteShell({
  company,
  locale,
  catalogSections,
  children,
}: {
  /** Company facts from «Контакти та компанія»; the layout reads them on the server. */
  company: Company;
  locale: Locale;
  catalogSections: readonly CatalogSection[];
  children: ReactNode;
}) {
  const dictionary = getShellDictionary(locale);

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        {dictionary.skipToContent}
      </a>
      <SiteHeader
        company={company}
        locale={locale}
        dictionary={dictionary}
        catalogSections={catalogSections}
      />
      <main id="content" className="mx-auto w-full max-w-[77.5rem] flex-1 px-4 sm:px-6">
        {children}
      </main>
      <SiteFooter
        company={company}
        locale={locale}
        dictionary={dictionary}
        catalogSections={catalogSections}
      />
      <MobileBar
        company={company}
        locale={locale}
        dictionary={dictionary}
        catalogSections={catalogSections}
      />
    </>
  );
}
