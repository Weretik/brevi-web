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
import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';

import { CatalogSectionIcon } from '../header/catalog-menu/catalog-section-icon';
import { SHELL_PATHS } from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { CatalogSection } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** Yellow «Каталог» of the phone header: a left sheet with the sections folded into their subsections. */
export function MobileCatalogSheet({
  locale,
  dictionary,
  catalogSections,
  triggerClassName,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
  catalogSections: readonly CatalogSection[];
  triggerClassName: string;
}) {
  const catalogHref = localizedPath(locale, SHELL_PATHS.catalog);
  return (
    <Sheet>
      <SheetTrigger className={triggerClassName}>{dictionary.links.catalog}</SheetTrigger>
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
  );
}
