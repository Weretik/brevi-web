import type { ProductOverview } from '../../entities/product-overview/product-overview';
import type {
  ProductArticlePrices,
  ProductOverviewPrices,
} from '../../entities/product-overview/product-overview-prices';

/** Quantity tiers of the sheet «Прайс на сайт» (`SewingPriceTiers.ForQuantity`). */
export const productPriceTierLabels = ['1–9 шт.', '10–40 шт.', 'від 41 шт.'] as const;

/** A model row of the «Товари» table; its articles follow it as detail rows when expanded. */
export interface ProductModelRow {
  kind: 'model';
  id: number;
  name: string;
  product: ProductOverview;
  prices: ProductOverviewPrices | null;
  expanded: boolean;
}

/** An Article under an expanded model. Its id is negative so it never collides with a product. */
export interface ProductArticleRow {
  kind: 'article';
  id: number;
  name: string;
  productId: number;
  article: ProductArticlePrices;
}

export type ProductListRow = ProductModelRow | ProductArticleRow;

/** A row has no price when nothing is published (sewing) or the rule price is missing (PPE). */
export function productHasPrice(prices: ProductOverviewPrices | null | undefined): boolean {
  return Boolean(prices?.from);
}

/** «Тканина … · арт. 602»: the fabric name when known, else only the sale SKU. */
export function productArticleLabel(
  article: ProductArticlePrices,
  fabricNames: ReadonlyMap<number, string>,
): string {
  const fabric = article.fabricId === null ? undefined : fabricNames.get(article.fabricId);
  return fabric ? `${fabric} · арт. ${article.saleSku}` : `Арт. ${article.saleSku}`;
}

/** Model rows in the given order, each expanded one followed by its Articles. */
export function buildProductListRows(
  products: readonly ProductOverview[],
  prices: ReadonlyMap<number, ProductOverviewPrices>,
  expanded: ReadonlySet<number>,
  fabricNames: ReadonlyMap<number, string>,
): ProductListRow[] {
  return products.flatMap((product) => {
    const productPrices = prices.get(product.id) ?? null;
    const open = expanded.has(product.id) && Boolean(productPrices?.articles.length);
    const model: ProductModelRow = {
      kind: 'model',
      id: product.id,
      name: product.name,
      product,
      prices: productPrices,
      expanded: open,
    };
    if (!open || !productPrices) return [model];
    return [
      model,
      ...productPrices.articles.map((article): ProductArticleRow => ({
        kind: 'article',
        id: -article.articleId,
        name: productArticleLabel(article, fabricNames),
        productId: product.id,
        article,
      })),
    ];
  });
}

/** Article SKUs of a row, so the search also finds a model by «602». */
export function productArticleSkus(prices: ProductOverviewPrices | null | undefined): string[] {
  return prices?.articles.map((article) => article.saleSku) ?? [];
}
