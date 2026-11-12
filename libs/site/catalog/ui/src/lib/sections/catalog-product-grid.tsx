import { CatalogProductTile } from './catalog-product-tile';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';
import type { CatalogProductCard } from '@site/catalog/model';

/** Photos above the fold load at once; the rest wait until the visitor scrolls to them. */
const EAGER_CARDS = 4;

/**
 * A plain listing of products without filters, for example «Інші моделі розділу» on a product page or the
 * search results. Photos are on the media server and have no known size, so they fill a fixed frame.
 */
export function CatalogProductGrid({
  products,
  dictionary,
  requestHref,
  productHref,
}: {
  products: readonly CatalogProductCard[];
  dictionary: CatalogDictionary['products'];
  requestHref: string;
  /** Localized link of a product page by its slug. */
  productHref: (slug: string) => string;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <CatalogProductTile
          key={product.slug}
          product={product}
          href={productHref(product.slug)}
          dictionary={dictionary}
          requestHref={requestHref}
          eager={index < EAGER_CARDS}
        />
      ))}
    </ul>
  );
}
