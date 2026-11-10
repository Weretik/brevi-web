import Link from 'next/link';

import { formatModelCount } from '../i18n/catalog-dictionary';

import type { CatalogTreeNode } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** Catalog root: every section as a card with its subsections as links. */
export function CatalogSectionsGrid({
  locale,
  sections,
  label,
  categoryHref,
}: {
  locale: Locale;
  sections: readonly CatalogTreeNode[];
  /** Accessible name of the list. */
  label: string;
  categoryHref: (slug: string) => string;
}) {
  return (
    <ul aria-label={label} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map((section, index) => (
        <li
          key={section.slug}
          className="flex flex-col gap-3 rounded-xl border border-border bg-background p-5"
        >
          <span
            aria-hidden
            className="flex items-center gap-2.5 font-mono text-xs font-semibold text-brand-text"
          >
            {String(index + 1).padStart(2, '0')}
            <span className="flex-1 border-t-2 border-dashed border-brand-soft" />
          </span>
          <h2 className="text-lg leading-snug font-extrabold">
            <Link href={categoryHref(section.slug)} className="hover:text-brand-text">
              {section.name[locale]}
            </Link>
          </h2>
          <p className="text-[0.8125rem] text-muted-foreground">
            {formatModelCount(locale, section.productCount)}
          </p>
          {section.children.length > 0 ? (
            <ul className="grid gap-1 border-t pt-3 text-[0.9375rem]">
              {section.children.map((child) => (
                <li key={child.slug}>
                  <Link
                    href={categoryHref(child.slug)}
                    className="inline-flex min-h-8 items-center font-semibold hover:text-brand-text"
                  >
                    {child.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
