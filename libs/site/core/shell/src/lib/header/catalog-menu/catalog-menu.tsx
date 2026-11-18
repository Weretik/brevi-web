'use client';

import { cn } from '@site/shared/ui';
import { ChevronDownIcon, LayoutGridIcon } from 'lucide-react';
import { useCallback, useId, useRef, useState } from 'react';

import { CatalogMenuPanel } from './catalog-menu-panel';
import { CatalogMenuPromo } from './catalog-menu-promo';
import { CatalogMenuSections } from './catalog-menu-sections';
import { useDismiss } from '../bar/use-dismiss';

import type { ShellDictionary } from '../../i18n/shell-dictionary';
import type { CatalogSection } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/**
 * The «Каталог» button of the header and its two-pane menu: sections on the left, the subsections of the
 * chosen section on the right, and the logo sewing card.
 * The whole menu is always in the HTML (hidden while closed), so every link is a real `<a href>` for crawlers.
 * It is positioned against the header container, which must be `relative`.
 */
export function CatalogMenu({
  locale,
  dictionary,
  sections,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
  sections: readonly CatalogSection[];
}) {
  const [open, setOpen] = useState(false);
  const [chosenKey, setActiveKey] = useState<string | null>(null);
  // Until the visitor points at a section, or when the chosen one has left the catalog, the first is open.
  const activeKey = sections.some((section) => section.key === chosenKey)
    ? chosenKey
    : sections[0]?.key;
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);

  return (
    <div ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'flex h-10.5 items-center gap-2.5 rounded-md pr-4 pl-3.5 text-[0.9375rem] font-extrabold transition-colors',
          open
            ? 'bg-brand text-foreground'
            : 'bg-primary text-primary-foreground hover:bg-primary/90',
        )}
      >
        <LayoutGridIcon
          aria-hidden
          className={cn('size-[1.125rem]', open ? 'text-foreground' : 'text-brand')}
          strokeWidth={2}
        />
        {dictionary.links.catalog}
        <ChevronDownIcon
          aria-hidden
          className={cn('size-4 transition-transform motion-reduce:transition-none', {
            'rotate-180': open,
          })}
          strokeWidth={2}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        role="region"
        aria-label={dictionary.catalogMenu}
        className="absolute inset-x-4 top-full z-40 grid max-h-[calc(100vh-5rem)] grid-cols-[17.5rem_minmax(0,1fr)] overflow-y-auto rounded-b-xl border border-t-0 border-border-strong bg-background shadow-lg sm:inset-x-6 xl:grid-cols-[18.75rem_minmax(0,1fr)_17.5rem]"
      >
        <CatalogMenuSections
          locale={locale}
          sections={sections}
          activeKey={activeKey}
          panelId={panelId}
          onChoose={setActiveKey}
        />

        <CatalogMenuPanel
          locale={locale}
          dictionary={dictionary}
          sections={sections}
          activeKey={activeKey}
          panelId={panelId}
          onNavigate={close}
        />

        <CatalogMenuPromo locale={locale} dictionary={dictionary} onNavigate={close} />
      </div>
    </div>
  );
}
