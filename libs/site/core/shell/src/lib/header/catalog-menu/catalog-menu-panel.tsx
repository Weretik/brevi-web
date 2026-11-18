'use client';

import { catalogCategoryPath, localizedPath } from '@site/core/i18n';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import { SHELL_PATHS } from '../../navigation/site-navigation';

import type { ShellDictionary } from '../../i18n/shell-dictionary';
import type { CatalogSection } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** Right pane of the catalog menu: the subsections of every section (only the active one shown) and the links under them. */
export function CatalogMenuPanel({
  locale,
  dictionary,
  sections,
  activeKey,
  panelId,
  onNavigate,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
  sections: readonly CatalogSection[];
  activeKey: string | null | undefined;
  panelId: string;
  onNavigate: () => void;
}) {
  const catalogHref = localizedPath(locale, SHELL_PATHS.catalog);
  const categoryHref = (slug: string) => localizedPath(locale, catalogCategoryPath(slug));
  return (
    <div className="p-7">
      {sections.map((section) => (
        <div key={section.key} id={`${panelId}-${section.key}`} hidden={section.key !== activeKey}>
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <p className="text-2xl leading-tight font-extrabold tracking-[-0.015em]">
              {section.label[locale]}
            </p>
            <Link
              href={categoryHref(section.slug)}
              onClick={onNavigate}
              aria-label={`${dictionary.sectionAll}: ${section.label[locale]}`}
              className="font-bold text-brand-text hover:underline"
            >
              {dictionary.sectionAll} <span aria-hidden>→</span>
            </Link>
          </div>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {section.items.map((item) => (
              <li key={item.key} className="border-b border-border">
                <Link
                  href={categoryHref(item.slug)}
                  onClick={onNavigate}
                  className="flex items-center justify-between gap-3 py-3 font-semibold hover:text-brand-text"
                >
                  {item.label[locale]}
                  <ChevronRightIcon
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground"
                    strokeWidth={1.75}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-dashed border-brand-soft pt-4 text-sm font-semibold">
        <Link
          href={catalogHref}
          onClick={onNavigate}
          className="rounded-full border border-border-strong px-3.5 py-2 hover:border-foreground"
        >
          {dictionary.allCatalog}
        </Link>
        <Link
          href={localizedPath(locale, SHELL_PATHS.deliveryAndPayment)}
          onClick={onNavigate}
          className="rounded-full border border-border-strong px-3.5 py-2 hover:border-foreground"
        >
          {dictionary.links.deliveryAndPayment}
        </Link>
      </div>
    </div>
  );
}
