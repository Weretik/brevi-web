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
        <ul className="grid max-h-[70vh] grid-cols-2 gap-3 overflow-y-auto p-5 xl:grid-cols-4">
          {CATALOG_SECTIONS.map((section, index) => (
            <li
              key={section.key}
              className="rounded-xl border border-border p-4 transition-colors hover:border-border-strong hover:bg-muted"
            >
              {/* The «Строчка» seam: section number in mono and a dashed orange line. */}
              <p
                aria-hidden
                className="mb-2.5 flex items-center gap-2.5 font-mono text-xs font-semibold text-brand-text"
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span className="flex-1 border-t-2 border-dashed border-brand-soft" />
              </p>
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-brand-soft px-6 py-3.5 text-sm">
          <Link
            href={catalogHref}
            onClick={close}
            className="font-bold text-brand-text hover:underline"
          >
            {dictionary.allCatalog} <span aria-hidden>→</span>
          </Link>
          <Link
            href={localizedPath(locale, SHELL_PATHS.wholesale)}
            onClick={close}
            className="font-mono text-[0.8125rem] font-semibold uppercase hover:text-brand-text"
          >
            {dictionary.links.wholesale}
          </Link>
        </div>
      </div>
    </div>
  );
}
