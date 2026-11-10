'use client';

import { CATALOG_SECTIONS } from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';
import { cn } from '@site/shared/ui';
import { ChevronDownIcon, ChevronRightIcon, LayoutGridIcon } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useId, useRef, useState } from 'react';

import { CatalogSectionIcon } from './catalog-section-icon';
import { useDismiss } from './use-dismiss';
import { SHELL_PATHS } from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
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
}: {
  locale: Locale;
  dictionary: ShellDictionary;
}) {
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string>(CATALOG_SECTIONS[0].key);
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
        <ul className="grid content-start gap-0.5 border-r border-border bg-muted p-3">
          {CATALOG_SECTIONS.map((section) => {
            const active = section.key === activeKey;
            return (
              <li key={section.key}>
                <button
                  type="button"
                  aria-expanded={active}
                  aria-controls={`${panelId}-${section.key}`}
                  onMouseEnter={() => setActiveKey(section.key)}
                  onFocus={() => setActiveKey(section.key)}
                  onClick={() => setActiveKey(section.key)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[0.9375rem] transition-colors',
                    active
                      ? 'bg-brand-surface font-extrabold'
                      : 'font-semibold hover:bg-background',
                  )}
                >
                  <CatalogSectionIcon
                    sectionKey={section.key}
                    className={cn(
                      'size-5 shrink-0',
                      active ? 'text-brand-text' : 'text-muted-foreground',
                    )}
                  />
                  <span className="flex-1">{section.label[locale]}</span>
                  <ChevronRightIcon
                    aria-hidden
                    className="size-4 text-muted-foreground"
                    strokeWidth={1.75}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="p-7">
          {CATALOG_SECTIONS.map((section) => (
            <div
              key={section.key}
              id={`${panelId}-${section.key}`}
              hidden={section.key !== activeKey}
            >
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <p className="text-2xl leading-tight font-extrabold tracking-[-0.015em]">
                  {section.label[locale]}
                </p>
                <Link
                  href={catalogHref}
                  onClick={close}
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
                      href={catalogHref}
                      onClick={close}
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
              onClick={close}
              className="rounded-full border border-border-strong px-3.5 py-2 hover:border-foreground"
            >
              {dictionary.allCatalog}
            </Link>
            <Link
              href={localizedPath(locale, SHELL_PATHS.deliveryAndPayment)}
              onClick={close}
              className="rounded-full border border-border-strong px-3.5 py-2 hover:border-foreground"
            >
              {dictionary.links.deliveryAndPayment}
            </Link>
          </div>
        </div>

        <aside className="m-4 ml-0 flex flex-col gap-3 rounded-xl bg-primary p-6 text-primary-foreground max-xl:hidden">
          <p className="font-mono text-xs font-semibold tracking-wider text-brand-soft uppercase">
            {dictionary.promoLabel}
          </p>
          <p className="text-xl leading-tight font-extrabold">{dictionary.promoTitle}</p>
          <p className="text-[0.9375rem] leading-normal text-primary-foreground/80">
            {dictionary.promoText}
          </p>
          <Link
            href={localizedPath(locale, SHELL_PATHS.logoPrinting)}
            onClick={close}
            className="mt-auto font-bold text-brand-soft hover:underline"
          >
            {dictionary.promoLink} <span aria-hidden>→</span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
