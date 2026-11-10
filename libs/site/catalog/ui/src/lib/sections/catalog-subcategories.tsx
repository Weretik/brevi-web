import Link from 'next/link';

import type { CatalogTreeNode } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** Subsections of a category as a row of links above the listing. */
export function CatalogSubcategories({
  locale,
  categories,
  label,
  categoryHref,
}: {
  locale: Locale;
  categories: readonly CatalogTreeNode[];
  /** Accessible name of the navigation. */
  label: string;
  categoryHref: (slug: string) => string;
}) {
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-2.5">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={categoryHref(category.slug)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong px-4 text-[0.9375rem] font-semibold hover:border-foreground"
            >
              {category.name[locale]}
              <span className="font-mono text-xs text-muted-foreground">
                {category.productCount}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
