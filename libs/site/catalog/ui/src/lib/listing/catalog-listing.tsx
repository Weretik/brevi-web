'use client';

import { Button } from '@site/shared/ui';

import { CatalogProductTile } from './catalog-product-tile';
import { catalogListingOptions } from './filters/catalog-listing-options';
import { ListingFilterChips } from './filters/listing-filter-chips';
import { ListingFilterSheet } from './filters/listing-filter-sheet';
import { useCatalogListing } from './use-catalog-listing';

import type { CatalogListingItem } from './catalog-listing-item';
import type { ListingText } from './filters/catalog-listing-options';
import type { CatalogDictionary } from '../i18n/catalog-dictionary';

export type { CatalogListingItem } from './catalog-listing-item';

const EAGER_CARDS = 4;

/**
 * The products of a category with the row above them: price ranges, fabrics (only when the models differ
 * in them), own sewing or protective equipment (only when the category has both), and the order. Every
 * card stays in the page for search engines; the filters and «Показати ще» only hide some. The choice is
 * kept in the address (`?price=…&sort=…`) so a link opens the same view; the page itself is the same for
 * every address.
 */
export function CatalogListing({
  items,
  products,
  text,
  requestHref,
}: {
  items: readonly CatalogListingItem[];
  products: CatalogDictionary['products'];
  text: ListingText;
  requestHref: string;
}) {
  const listing = useCatalogListing(items);
  const options = catalogListingOptions(text, listing.facets);

  return (
    <div className="grid gap-4">
      <div className="sticky top-15 z-20 -mx-4 flex flex-wrap items-center gap-2 border-b border-border bg-background/95 px-4 py-2 backdrop-blur sm:mx-0 sm:px-0 lg:top-14">
        <ListingFilterSheet listing={listing} options={options} text={text} />
        <ListingFilterChips listing={listing} options={options} text={text} />
      </div>

      {listing.found === 0 ? (
        <p className="max-w-[48rem] leading-relaxed text-muted-foreground">{text.nothing}</p>
      ) : null}

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {listing.ordered.map((item, index) => (
          <CatalogProductTile
            key={item.product.slug}
            product={item.product}
            href={item.href}
            dictionary={products}
            requestHref={requestHref}
            eager={index < EAGER_CARDS}
            hidden={!listing.isOpen(item)}
          />
        ))}
      </ul>

      {listing.more > 0 ? (
        <Button
          variant="outline"
          size="lg"
          className="justify-self-center"
          onClick={listing.showMore}
        >
          {text.showMore} ({listing.more})
        </Button>
      ) : null}
    </div>
  );
}
