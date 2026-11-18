'use client';

import { localizedPath } from '@site/core/i18n';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@site/shared/ui';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

import { MAIN_NAV_LINKS, SHELL_PATHS } from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Company } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

/** «Меню» of the bottom bar: a right sheet with the main links and the contacts. */
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
  const [phone] = company.phones;
  return (
    <Sheet>
      <SheetTrigger className={triggerClassName} aria-label={dictionary.openMenu}>
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
  );
}
