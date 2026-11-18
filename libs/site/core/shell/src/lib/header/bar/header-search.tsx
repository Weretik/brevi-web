'use client';

import { CatalogSearchBox, getCatalogDictionary } from '@site/catalog/ui';
import { SITE_PATHS, catalogSearchIndexPath, localizedPath } from '@site/core/i18n';
import { cn } from '@site/shared/ui';
import { SearchIcon, XIcon } from 'lucide-react';
import { useCallback, useId, useRef, useState } from 'react';

import { useDismiss } from './use-dismiss';

import type { Locale } from '@site/core/i18n';

/**
 * «Пошук» in the header: a button that opens the catalog search under the header, with the field in focus.
 * The panel spans the header width; Escape, a press outside, or picking a suggestion closes it.
 */
export function HeaderSearch({
  locale,
  variant,
}: {
  locale: Locale;
  /** `menu`: a labelled button in the menu row; `icon`: an icon button in the phone header. */
  variant: 'menu' | 'icon';
}) {
  const text = getCatalogDictionary(locale).search;
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(root, open, close);

  return (
    <div ref={root}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={variant === 'icon' ? text.open : undefined}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'inline-flex items-center gap-2 rounded-md font-semibold whitespace-nowrap hover:text-brand-text focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          variant === 'icon' ? 'size-11 justify-center' : 'h-10 px-1 text-sm xl:text-[0.9375rem]',
        )}
      >
        {open ? (
          <XIcon aria-hidden className="size-5" strokeWidth={1.9} />
        ) : (
          <SearchIcon aria-hidden className="size-5" strokeWidth={1.9} />
        )}
        {variant === 'menu' ? text.open : null}
      </button>
      {open ? (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full z-40 border-b border-border bg-background shadow-lg"
        >
          <div className="mx-auto max-w-[50rem] px-4 py-4 sm:px-6">
            <CatalogSearchBox
              indexUrl={catalogSearchIndexPath(locale)}
              action={localizedPath(locale, SITE_PATHS.search)}
              text={text}
              autoFocus
              onNavigate={close}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
