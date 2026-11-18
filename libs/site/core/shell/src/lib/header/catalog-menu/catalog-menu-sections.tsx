'use client';

import { cn } from '@site/shared/ui';
import { ChevronRightIcon } from 'lucide-react';

import { CatalogSectionIcon } from './catalog-section-icon';

import type { CatalogSection } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** Left pane of the catalog menu: the sections; pointing at one opens its subsections. */
export function CatalogMenuSections({
  locale,
  sections,
  activeKey,
  panelId,
  onChoose,
}: {
  locale: Locale;
  sections: readonly CatalogSection[];
  activeKey: string | null | undefined;
  panelId: string;
  onChoose: (key: string) => void;
}) {
  return (
    <ul className="grid content-start gap-0.5 border-r border-border bg-muted p-3">
      {sections.map((section) => {
        const active = section.key === activeKey;
        return (
          <li key={section.key}>
            <button
              type="button"
              aria-expanded={active}
              aria-controls={`${panelId}-${section.key}`}
              onMouseEnter={() => onChoose(section.key)}
              onFocus={() => onChoose(section.key)}
              onClick={() => onChoose(section.key)}
              className={cn(
                'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[0.9375rem] transition-colors',
                active ? 'bg-brand-surface font-extrabold' : 'font-semibold hover:bg-background',
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
  );
}
