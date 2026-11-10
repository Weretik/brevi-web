import Link from 'next/link';

import type { CatalogSection } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/**
 * Catalog sections as cards. Product cards with the three prices of the mockup come with the catalog step;
 * until then every card opens the catalog root.
 */
export function HomeCatalog({
  locale,
  sections,
  catalogHref,
}: {
  locale: Locale;
  sections: readonly CatalogSection[];
  catalogHref: string;
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {sections.map((section, index) => (
        <li key={section.key}>
          <Link
            href={catalogHref}
            className="group flex h-full flex-col gap-2.5 rounded-xl border border-border bg-background p-4 transition-colors hover:border-border-strong hover:bg-muted"
          >
            <span
              aria-hidden
              className="flex items-center gap-2.5 font-mono text-xs font-semibold text-brand-text"
            >
              {String(index + 1).padStart(2, '0')}
              <span className="flex-1 border-t-2 border-dashed border-brand-soft" />
            </span>
            <span className="font-extrabold group-hover:text-brand-text">
              {section.label[locale]}
            </span>
            <span className="text-[0.8125rem] leading-relaxed text-muted-foreground">
              {section.items.map((item) => item.label[locale]).join(' · ')}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
