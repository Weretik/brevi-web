'use client';

import { catalogCategoryPath, localizedPath } from '@site/core/i18n';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@site/shared/ui';
import {
  ChevronDownIcon,
  ClipboardListIcon,
  LayoutGridIcon,
  MenuIcon,
  PhoneIcon,
} from 'lucide-react';
import Link from 'next/link';

import { CatalogSectionIcon } from '../header/catalog-section-icon';
import { MAIN_NAV_LINKS, SHELL_PATHS } from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { CatalogSection } from '@site/catalog/model';
import type { Company } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

const ITEM =
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
  const catalogHref = localizedPath(locale, SHELL_PATHS.catalog);

  return (
    <nav
      aria-label={dictionary.quickActions}
      className="fixed inset-x-0 bottom-0 z-30 flex h-17 border-t border-border-strong bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <Sheet>
        <SheetTrigger className={`${ITEM} text-brand-text`}>
          <LayoutGridIcon aria-hidden strokeWidth={1.75} />
          {dictionary.links.catalog}
        </SheetTrigger>
        <SheetContent side="left" closeLabel={dictionary.closeMenu} className="gap-0 p-0">
          <SheetTitle className="border-b border-border px-5 py-4 text-lg font-extrabold">
            {dictionary.links.catalog}
          </SheetTitle>
          <SheetDescription>{dictionary.catalogMenu}</SheetDescription>
          <ul>
            {catalogSections.map((section) => (
              <li key={section.key} className="border-b border-border">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center gap-3.5 px-5 py-3.5 font-bold group-open:bg-brand-surface [&::-webkit-details-marker]:hidden">
                    <CatalogSectionIcon
                      sectionKey={section.key}
                      className="size-5.5 shrink-0 text-brand-text"
                    />
                    <span className="flex-1">{section.label[locale]}</span>
                    <ChevronDownIcon
                      aria-hidden
                      className="size-4 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none"
                      strokeWidth={1.75}
                    />
                  </summary>
                  <ul className="grid pt-1 pr-5 pb-3 pl-14 text-[0.9375rem]">
                    <li>
                      <SheetClose asChild>
                        <Link
                          href={localizedPath(locale, catalogCategoryPath(section.slug))}
                          className="block py-2 font-bold text-brand-text"
                        >
                          {dictionary.sectionAll}
                        </Link>
                      </SheetClose>
                    </li>
                    {section.items.map((item) => (
                      <li key={item.key}>
                        <SheetClose asChild>
                          <Link
                            href={localizedPath(locale, catalogCategoryPath(item.slug))}
                            className="block py-2"
                          >
                            {item.label[locale]}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
          <SheetClose asChild>
            <Link href={catalogHref} className="px-5 py-4 font-bold text-brand-text">
              {dictionary.allCatalog} <span aria-hidden>→</span>
            </Link>
          </SheetClose>
        </SheetContent>
      </Sheet>

      <Link href={localizedPath(locale, SHELL_PATHS.request)} rel="nofollow" className={ITEM}>
        <ClipboardListIcon aria-hidden strokeWidth={1.75} />
        {dictionary.request}
      </Link>

      <a
        href={`tel:${phone.e164}`}
        aria-label={`${dictionary.call}: ${phone.display}`}
        className={`${ITEM} bg-brand text-foreground`}
      >
        <PhoneIcon aria-hidden strokeWidth={1.75} />
        {dictionary.callShort}
      </a>

      <Sheet>
        <SheetTrigger className={ITEM} aria-label={dictionary.openMenu}>
          <MenuIcon aria-hidden strokeWidth={1.75} />
          {dictionary.menuTitle}
        </SheetTrigger>
        <SheetContent side="right" closeLabel={dictionary.closeMenu} className="gap-0 p-0">
          <SheetTitle className="border-b border-border px-5 py-4 text-lg font-extrabold">
            {dictionary.menuTitle}
          </SheetTitle>
          <SheetDescription>{dictionary.mainNav}</SheetDescription>
          <ul className="font-bold">
            {MAIN_NAV_LINKS.map((link) => (
              <li key={link.key} className="border-b border-border">
                <SheetClose asChild>
                  <Link href={localizedPath(locale, link.path)} className="block px-5 py-3.5">
                    {dictionary.links[link.key]}
                  </Link>
                </SheetClose>
              </li>
            ))}
            <li className="border-b border-border">
              <SheetClose asChild>
                <Link
                  href={localizedPath(locale, SHELL_PATHS.deliveryAndPayment)}
                  className="block px-5 py-3.5"
                >
                  {dictionary.links.deliveryAndPayment}
                </Link>
              </SheetClose>
            </li>
          </ul>
          <address className="mt-auto grid gap-1.5 border-t border-dashed border-brand-soft bg-muted px-5 py-4 text-sm text-muted-foreground not-italic">
            <a href={`tel:${phone.e164}`} className="text-xl font-extrabold text-foreground">
              {phone.display}
            </a>
            <span>{company.openingHours.label[locale]}</span>
            <a href={`mailto:${company.email}`}>{company.email}</a>
            <span>
              {company.address.city[locale]}, {company.address.street[locale]} · {dictionary.vat}
            </span>
          </address>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
