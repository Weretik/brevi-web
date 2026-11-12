import { getCatalogProducts, getCatalogTree } from '@site/catalog/data-access';
import { catalogCategoryPath, catalogProductPath, localizedPath } from '@site/core/i18n';

import type { CatalogSearchIndex, CatalogTreeNode } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/**
 * Every product and category of the site for the search box, in the language of the page, with the
 * addresses of their pages. Both lists come from the cached catalog answers, so building it asks the API
 * nothing new; while the API is unavailable both lists are empty.
 */
export async function buildCatalogSearchIndex(locale: Locale): Promise<CatalogSearchIndex> {
  const [tree, products] = await Promise.all([getCatalogTree(), getCatalogProducts(locale)]);
  const sections = (
    nodes: readonly CatalogTreeNode[],
    parent: string | null,
  ): CatalogSearchIndex['sections'] =>
    nodes.flatMap((node) => [
      {
        slug: node.slug,
        name: node.name[locale],
        parent,
        productCount: node.productCount,
        href: localizedPath(locale, catalogCategoryPath(node.slug)),
      },
      ...sections(node.children, node.name[locale]),
    ]);

  return {
    products: products.map((product) => ({
      slug: product.slug,
      name: product.name,
      code: product.code,
      type: product.type,
      image: product.image,
      priceFrom: product.priceFrom,
      href: localizedPath(locale, catalogProductPath(product.slug)),
    })),
    sections: sections(tree, null),
  };
}
