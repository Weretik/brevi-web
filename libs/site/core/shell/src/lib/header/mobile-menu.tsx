'use client';

import { COMPANY } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@site/shared/ui';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

import { CATALOG_SECTIONS } from '../navigation/catalog-sections';
import { MAIN_NAV_LINKS, SHELL_PATHS } from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

/** Phone and tablet menu in a side sheet: the header menu, catalog sections, and both phones. */
export function MobileMenu({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
}) {
  const catalogHref = localizedPath(locale, SHELL_PATHS.catalog);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={dictionary.openMenu}>
          <MenuIcon strokeWidth={1.75} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" closeLabel={dictionary.closeMenu}>
        <SheetTitle>{dictionary.menuTitle}</SheetTitle>
        <SheetDescription>{dictionary.tagline}</SheetDescription>
        <ul className="grid gap-1 font-semibold">
          <li>
            <SheetClose asChild>
              <Link href={catalogHref} className="block rounded-md px-2 py-2.5 hover:bg-muted">
                {dictionary.links.catalog}
              </Link>
            </SheetClose>
            <ul className="mb-2 ml-2 grid border-l-2 border-dashed border-brand-soft pl-3 text-sm font-medium text-muted-foreground">
              {CATALOG_SECTIONS.map((section) => (
                <li key={section.key}>
                  <SheetClose asChild>
                    <Link href={catalogHref} className="block rounded-md px-2 py-2 hover:bg-muted">
                      {section.label[locale]}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </li>
          {MAIN_NAV_LINKS.map((link) => (
            <li key={link.key}>
              <SheetClose asChild>
                <Link
                  href={localizedPath(locale, link.path)}
                  className="block rounded-md px-2 py-2.5 hover:bg-muted"
                >
                  {dictionary.links[link.key]}
                </Link>
              </SheetClose>
            </li>
          ))}
        </ul>
        <address className="mt-auto grid gap-2 border-t border-dashed border-border-strong pt-4 text-sm not-italic">
          {COMPANY.phones.map((phone) => (
            <a key={phone.e164} href={`tel:${phone.e164}`} className="font-mono font-semibold">
              {phone.display}
            </a>
          ))}
          <span className="text-muted-foreground">{COMPANY.openingHours.label[locale]}</span>
        </address>
      </SheetContent>
    </Sheet>
  );
}
