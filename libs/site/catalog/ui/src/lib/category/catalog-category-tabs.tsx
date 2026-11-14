import { cn } from '@site/shared/ui';
import Link from 'next/link';

import { CatalogTabsScroller } from './catalog-tabs-scroller';

/** One tab: a category page with its model count. */
export type CatalogCategoryTab = { slug: string; name: string; count: number };

/**
 * Subcategories as a row of tabs above the listing: «Усі» (the parent category) first, then every
 * subcategory, the open one marked. They are plain links, so each subcategory keeps its own indexed page.
 * The row scrolls sideways on a narrow screen instead of wrapping into a column of buttons.
 */
export function CatalogCategoryTabs({
  parent,
  items,
  current,
  label,
  allLabel,
  categoryHref,
}: {
  /** The «Усі» tab: the category whose subcategories these are. */
  parent: CatalogCategoryTab;
  items: readonly CatalogCategoryTab[];
  /** Slug of the open page. */
  current: string;
  /** Accessible name of the navigation. */
  label: string;
  allLabel: string;
  categoryHref: (slug: string) => string;
}) {
  const tabs = [{ ...parent, name: allLabel }, ...items];

  return (
    <CatalogTabsScroller label={label}>
      <ul className="flex min-w-max gap-5 border-b border-border sm:min-w-0 sm:flex-wrap sm:gap-x-6 sm:gap-y-0">
        {tabs.map((tab) => {
          const open = tab.slug === current;
          return (
            <li key={tab.slug}>
              <Link
                href={categoryHref(tab.slug)}
                aria-current={open ? 'page' : undefined}
                className={cn(
                  'inline-flex min-h-11 items-center gap-1.5 border-b-[3px] border-transparent text-[0.9375rem] font-bold whitespace-nowrap text-muted-foreground hover:text-foreground',
                  open && 'border-brand text-foreground',
                )}
              >
                {tab.name}
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  {tab.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </CatalogTabsScroller>
  );
}
