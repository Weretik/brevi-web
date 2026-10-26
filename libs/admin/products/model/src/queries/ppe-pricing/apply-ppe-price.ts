import type { PpeProductPricing } from '../../entities/ppe-pricing/ppe-product-pricing';
import type { Product } from '../../product-list/product';

export function applyPpePrice<T extends Product>(
  product: T,
  prices: readonly PpeProductPricing[],
  state: 'ready' | 'loading' | 'error',
): T {
  if (product.type !== 'Ppe') return product;
  const current = prices.find((x) => x.productId === product.id);
  return {
    ...product,
    minimumWholesalePrice: state === 'ready' ? (current?.prices?.wholesale ?? 0) : 0,
    ppePriceStatus: state !== 'ready' ? state : current?.prices ? 'calculated' : 'blocked',
  };
}
