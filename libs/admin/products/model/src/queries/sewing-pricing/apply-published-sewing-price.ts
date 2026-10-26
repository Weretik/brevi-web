import type { PublishedSewingProduct } from '../../entities/sewing-pricing/published-sewing-product';
import type { Product } from '../../product-list/product';

export function applyPublishedSewingPrice<T extends Product>(
  product: T,
  publications: readonly PublishedSewingProduct[],
  state: 'ready' | 'loading' | 'error',
): T {
  if (product.type !== 'Sewing') return product;
  const current = publications.find((item) => item.productId === product.id);
  const amounts = current?.articles.map((article) => article.prices.wholesale) ?? [];
  return {
    ...product,
    minimumWholesalePrice: state === 'ready' && amounts.length ? Math.min(...amounts) : 0,
    sewingPriceStatus: state !== 'ready' ? state : amounts.length ? 'published' : 'unpublished',
  };
}
