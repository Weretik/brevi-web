import type {
  ProductOverview,
  ProductVariant,
} from '../../entities/product-overview/product-overview';

/** Quantity tiers of the sheet «Прайс на сайт» (`SewingPriceTiers.ForQuantity`). */
export const productPriceTierLabels = ['1–9 шт.', '10–40 шт.', 'від 41 шт.'] as const;

/** A model row of the «Товари» table; its fabric variants follow it as detail rows when expanded. */
export interface ProductModelRow {
  kind: 'model';
  id: number;
  name: string;
  product: ProductOverview;
  expanded: boolean;
}

/** A fabric variant under an expanded model. Its id is negative so it never collides with a product. */
export interface ProductVariantRow {
  kind: 'variant';
  id: number;
  name: string;
  productId: number;
  variant: ProductVariant;
}

export type ProductListRow = ProductModelRow | ProductVariantRow;

/** «Габардин · арт. 602»: the fabric name when known, else only the sale SKU. */
export function productVariantLabel(variant: ProductVariant): string {
  return variant.fabricName
    ? `${variant.fabricName} · арт. ${variant.saleSku}`
    : `Арт. ${variant.saleSku}`;
}

/** Model rows in the server's order, each expanded one followed by its fabric variants. */
export function buildProductListRows(
  products: readonly ProductOverview[],
  expanded: ReadonlySet<number>,
): ProductListRow[] {
  return products.flatMap((product) => {
    const open = expanded.has(product.id) && product.variants.length > 0;
    const model: ProductModelRow = {
      kind: 'model',
      id: product.id,
      name: product.name,
      product,
      expanded: open,
    };
    if (!open) return [model];
    return [
      model,
      ...product.variants.map((variant): ProductVariantRow => ({
        kind: 'variant',
        id: -variant.articleId,
        name: productVariantLabel(variant),
        productId: product.id,
        variant,
      })),
    ];
  });
}
