'use client';

import { localizedPath } from '@site/core/i18n';
import { cn } from '@site/shared/ui';
import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useId, useRef, useState } from 'react';

import { useDismiss } from './use-dismiss';
import { CATALOG_SECTIONS } from '../navigation/catalog-sections';
import { SHELL_PATHS } from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

/**
 * «Каталог» in the header menu: a button that opens the mega menu with every section and subsection.
 * The panel is always in the HTML (hidden while closed), so every link is a real `<a href>` for crawlers.
 * It is positioned against the header container, which must be `relative`.
 */
export function CatalogMenu({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);

  // Category slugs arrive with the BreviERP category tree; until then every entry opens the catalog root.
  const catalogHref = localizedPath(locale, SHELL_PATHS.catalog);

  return (
    <div ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex items-center gap-1 rounded-sm transition-colors hover:text-brand-text"
      >
        {dictionary.links.catalog}
        <ChevronDownIcon
          aria-hidden
          className={cn('size-4 transition-transform motion-reduce:transition-none', {
            'rotate-180': open,
          })}
          strokeWidth={1.75}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        role="region"
        aria-label={dictionary.catalogMenu}
        className="absolute inset-x-6 top-full z-40 rounded-b-xl border border-t-0 border-border-strong bg-background shadow-lg"
      >
        <ul className="grid max-h-[70vh] grid-cols-2 gap-x-8 gap-y-6 overflow-y-auto p-6 xl:grid-cols-4">
          {CATALOG_SECTIONS.map((section) => (
            <li key={section.key}>
              <Link
                href={catalogHref}
                onClick={close}
                className="font-extrabold hover:text-brand-text"
              >
                {section.label[locale]}
              </Link>
              <ul className="mt-2 grid gap-1.5 text-sm font-medium text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item.key}>
                    <Link href={catalogHref} onClick={close} className="hover:text-brand-text">
                      {item.label[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-border-strong px-6 py-3 text-sm">
          <Link href={catalogHref} onClick={close} className="font-bold hover:text-brand-text">
            {dictionary.allCatalog}
          </Link>
          <Link
            href={localizedPath(locale, SHELL_PATHS.wholesale)}
            onClick={close}
            className="font-semibold text-brand-text hover:underline"
          >
            {dictionary.links.wholesale}
          </Link>
        </div>
      </div>
    </div>
  );
}
