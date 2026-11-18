'use client';

import { localizedPath } from '@site/core/i18n';
import { ClipboardListIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';

import { MobileCatalogSheet } from './mobile-catalog-sheet';
import { MobileMenuSheet } from './mobile-menu-sheet';
import { SHELL_PATHS } from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { CatalogSection } from '@site/catalog/model';
import type { Company } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

/** One button of the bar: an icon over a short label. */
const MOBILE_BAR_ITEM =
  'flex flex-1 flex-col items-center justify-center gap-1 text-[0.6875rem] font-bold [&_svg]:size-6';

/**
 * Phone and tablet bar fixed to the bottom of the screen: «Каталог», «Заявка», «Дзвінок», «Меню».
 * The catalog and the menu open in side sheets, which are rendered only while open.
 */
export function MobileBar({
  company,
  locale,
  dictionary,
  catalogSections,
}: {
  /** Company facts from «Контакти та компанія». */
  company: Company;
  locale: Locale;
  dictionary: ShellDictionary;
  catalogSections: readonly CatalogSection[];
}) {
  const [phone] = company.phones;

  return (
    <nav
      aria-label={dictionary.quickActions}
      className="fixed inset-x-0 bottom-0 z-30 flex h-17 border-t border-border-strong bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <MobileCatalogSheet
        locale={locale}
        dictionary={dictionary}
        catalogSections={catalogSections}
        triggerClassName={`${MOBILE_BAR_ITEM} text-brand-text`}
      />

      <Link
        href={localizedPath(locale, SHELL_PATHS.request)}
        rel="nofollow"
        className={MOBILE_BAR_ITEM}
      >
        <ClipboardListIcon aria-hidden strokeWidth={1.75} />
        {dictionary.request}
      </Link>

      <a
        href={`tel:${phone.e164}`}
        aria-label={`${dictionary.call}: ${phone.display}`}
        className={`${MOBILE_BAR_ITEM} bg-brand text-foreground`}
      >
        <PhoneIcon aria-hidden strokeWidth={1.75} />
        {dictionary.callShort}
      </a>

      <MobileMenuSheet
        company={company}
        locale={locale}
        dictionary={dictionary}
        triggerClassName={MOBILE_BAR_ITEM}
      />
    </nav>
  );
}
