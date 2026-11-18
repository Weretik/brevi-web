import type { CatalogProduct, CatalogProductFacts } from '@site/catalog/model';
import type { CatalogDictionary } from '@site/catalog/ui';

type ProductText = CatalogDictionary['product'];

/** Characteristics of the page: the short facts first as their own group, then the product's groups. */
export function productSpecs(
  product: CatalogProduct,
  facts: CatalogProductFacts,
  summaryTitle: string,
): CatalogProduct['specs'] {
  return [
    ...(facts.rows.length > 0 ? [{ title: summaryTitle, rows: facts.rows }] : []),
    ...product.specs,
  ];
}

/** Links to the blocks the page shows, then the size chart. */
export function productNav(
  text: ProductText,
  shown: { specs: boolean; description: boolean; related: boolean; sizesHref: string },
): { href: string; label: string }[] {
  return [
    shown.specs ? { href: '#product-specs', label: text.specs.title } : null,
    shown.description ? { href: '#product-description', label: text.description.label } : null,
    shown.related ? { href: '#product-related', label: text.related.label } : null,
    { href: shown.sizesHref, label: text.nav.sizes },
  ].filter((item) => item !== null);
}
