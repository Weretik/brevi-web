'use client';

import { CatalogSearchBox, getCatalogDictionary } from '@site/catalog/ui';
import { SITE_PATHS, catalogSearchIndexPath, localizedPath, requestHref } from '@site/core/i18n';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
  buttonVariants,
  cn,
} from '@site/shared/ui';
import Link from 'next/link';
import { useState } from 'react';

import { LocaleSwitch } from '../controls/locale-switch';
import { MAIN_NAV_LINKS } from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Company } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

/**
 * «Меню» of the phone header: a right sheet with the catalog search, the main links, «Залишити заявку», the
 * language and the contacts. Search and the language live here on phones so the header stays short.
 */
export function MobileMenuSheet({
  company,
  locale,
  dictionary,
  triggerClassName,
}: {
  company: Company;
  locale: Locale;
  dictionary: ShellDictionary;
  triggerClassName: string;
}) {
  const [open, setOpen] = useState(false);
  const [phone] = company.phones;
  const search = getCatalogDictionary(locale).search;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={triggerClassName}>{dictionary.menuTitle}</SheetTrigger>
      <SheetContent
        side="right"
        closeLabel={dictionary.closeMenu}
        className="gap-0 p-0"
        // Focus the panel, not the search field, so the phone keyboard does not cover the menu.
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          (event.currentTarget as HTMLElement).focus();
        }}
      >
        <SheetTitle className="border-b border-border px-5 py-4 text-lg font-extrabold">
          {dictionary.menuTitle}
        </SheetTitle>
        <SheetDescription>{dictionary.mainNav}</SheetDescription>
        <div className="border-b border-border px-5 py-4">
          <CatalogSearchBox
            indexUrl={catalogSearchIndexPath(locale)}
            action={localizedPath(locale, SITE_PATHS.search)}
            text={search}
            onNavigate={() => setOpen(false)}
          />
        </div>
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
        </ul>
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <SheetClose asChild>
            <Link
              href={requestHref(locale)}
              rel="nofollow"
              className={cn(buttonVariants({ variant: 'brand' }), 'flex-1')}
            >
              {dictionary.requestLong}
            </Link>
          </SheetClose>
          <LocaleSwitch locale={locale} label={dictionary.languageSwitch} />
        </div>
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
  );
}
