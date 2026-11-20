'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRef } from 'react';

import { CatalogProductTile } from './catalog-product-tile';

import type { CatalogListingItem } from './catalog-listing-item';
import type { CatalogDictionary } from '../../i18n/catalog-dictionary';

const ARROW =
  'flex size-10 items-center justify-center rounded-full border border-border-strong bg-background hover:border-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

/**
 * A row of product cards that scrolls sideways: four on wide screens, two on phones, swiped or moved with the
 * arrows. Every card stays in the HTML, so search engines see the links; «Купити» opens the request window.
 */
export function CatalogProductCarousel({
  items,
  dictionary,
  requestHref,
  labels,
}: {
  items: readonly CatalogListingItem[];
  dictionary: CatalogDictionary['products'];
  requestHref: string;
  labels: CatalogDictionary['carousel'];
}) {
  const list = useRef<HTMLUListElement>(null);
  const move = (direction: 1 | -1) =>
    list.current?.scrollBy({ left: direction * list.current.clientWidth, behavior: 'smooth' });

  return (
    <div className="grid gap-4">
      <ul
        ref={list}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:mx-0 sm:scroll-px-0 sm:gap-4 sm:px-0"
      >
        {items.map((item) => (
          <CatalogProductTile
            key={item.product.slug}
            product={item.product}
            href={item.href}
            dictionary={dictionary}
            requestHref={requestHref}
            className="w-[calc(50%-0.375rem)] shrink-0 snap-start md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)]"
          />
        ))}
      </ul>
      {items.length > 2 ? (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className={ARROW}
            aria-label={labels.previous}
            onClick={() => move(-1)}
          >
            <ChevronLeftIcon aria-hidden className="size-5" strokeWidth={1.75} />
          </button>
          <button type="button" className={ARROW} aria-label={labels.next} onClick={() => move(1)}>
            <ChevronRightIcon aria-hidden className="size-5" strokeWidth={1.75} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
