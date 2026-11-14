import Link from 'next/link';

import { CatalogCategoryIcon } from './catalog-category-icon';
import { formatModelCount, formatPrice } from '../i18n/catalog-dictionary';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';
import type { CatalogProductType } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** A top-level category on the catalog root: its icon, models, lowest price, and subcategories. */
export type CatalogSectionTile = {
  slug: string;
  name: string;
  productCount: number;
  /** The lowest «від» price of its models; `null` when none has a price. */
  priceFrom: number | null;
  children: readonly { slug: string; name: string }[];
};

/** Categories of one kind: own sewing first, then protective equipment. */
export type CatalogSectionGroup = {
  type: CatalogProductType;
  sections: readonly CatalogSectionTile[];
};

/**
 * Catalog root: the categories in two groups, «Власне пошиття» and «Засоби захисту», each a card with an
 * icon, the number of models, the lowest price, and its subcategories as links.
 */
export function CatalogSectionGroups({
  locale,
  groups,
  dictionary,
  categoryHref,
}: {
  locale: Locale;
  groups: readonly CatalogSectionGroup[];
  dictionary: CatalogDictionary;
  categoryHref: (slug: string) => string;
}) {
  return (
    <div className="grid gap-10">
      {groups.map((group) => {
        const titleId = `catalog-group-${group.type}`;
        const text = dictionary.groups[group.type];
        return (
          <section key={group.type} aria-labelledby={titleId} className="grid gap-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 id={titleId} className="text-xl font-extrabold tracking-[-0.015em]">
                {text.title}
              </h2>
              <p className="text-sm text-muted-foreground">{text.lead}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.sections.map((section) => (
                <li
                  key={section.slug}
                  className="relative grid content-start gap-3 rounded-xl border border-border bg-background p-4 hover:border-border-strong"
                >
                  <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-brand-surface text-brand-text">
                      <CatalogCategoryIcon slug={section.slug} className="size-6" />
                    </span>
                    <span className="grid leading-tight">
                      <Link
                        href={categoryHref(section.slug)}
                        className="font-extrabold hover:text-brand-text hover:underline"
                      >
                        {section.name}
                      </Link>
                      <span className="text-[0.8125rem] text-muted-foreground">
                        {formatModelCount(locale, section.productCount)}
                        {section.priceFrom === null
                          ? null
                          : ` · ${dictionary.products.priceFrom} ${formatPrice(section.priceFrom)} грн`}
                      </span>
                    </span>
                  </div>
                  {section.children.length > 0 ? (
                    <ul className="flex flex-wrap gap-x-3 gap-y-1 border-t border-border pt-3 text-sm">
                      {section.children.map((child) => (
                        <li key={child.slug}>
                          <Link
                            href={categoryHref(child.slug)}
                            className="inline-flex min-h-8 items-center font-semibold text-muted-foreground hover:text-brand-text"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
