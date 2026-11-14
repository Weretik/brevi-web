import type { CatalogProductCard } from '@site/catalog/model';

/** A product of the listing with the address of its page, worked out on the server. */
export type CatalogListingItem = { product: CatalogProductCard; href: string };
