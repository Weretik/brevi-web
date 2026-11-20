import { PhoneIcon } from 'lucide-react';

import { MobileCatalogSheet } from './mobile-catalog-sheet';
import { MobileMenuSheet } from './mobile-menu-sheet';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { CatalogSection } from '@site/catalog/model';
import type { Company } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

/**
 * Right side of the phone and tablet header, read from the right: «Меню», the yellow «Каталог», the phone.
 * The phone is an icon on narrow screens and the number from `sm`. Search, the language and «Залишити
 * заявку» are inside «Меню», so the header keeps three actions.
 */
export function MobileHeaderActions({
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
    <div className="flex shrink-0 items-center gap-1 sm:gap-2.5 lg:hidden">
      <a
        href={`tel:${phone.e164}`}
        aria-label={`${dictionary.call}: ${phone.display}`}
        className="flex size-9 items-center justify-center rounded-full bg-brand-surface text-brand-text sm:size-auto sm:bg-transparent sm:px-1 sm:text-[0.9375rem] sm:font-extrabold sm:whitespace-nowrap sm:text-foreground"
      >
        <PhoneIcon aria-hidden className="size-5 sm:hidden" strokeWidth={1.75} />
        <span className="max-sm:hidden">{phone.display}</span>
      </a>
      <MobileCatalogSheet
        locale={locale}
        dictionary={dictionary}
        catalogSections={catalogSections}
        triggerClassName="inline-flex h-9 items-center rounded-md bg-brand px-2.5 text-[0.8125rem] font-extrabold sm:h-10 sm:px-4 sm:text-sm text-foreground hover:bg-brand/90"
      />
      <MobileMenuSheet
        company={company}
        locale={locale}
        dictionary={dictionary}
        triggerClassName="inline-flex h-9 items-center rounded-md px-1 text-[0.8125rem] font-extrabold sm:h-10 sm:px-1.5 sm:text-sm hover:text-brand-text"
      />
    </div>
  );
}
