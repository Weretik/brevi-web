import { usePpeProductPrices } from '../ppe-pricing/use-ppe-product-prices';
import { usePublishedProductPrices } from '../sewing-pricing/use-published-product-prices';

import type { Product } from '@admin/products/model';

export function useProductPrices<T extends Product>(products: readonly T[]) {
  const sewing = usePublishedProductPrices(products);
  const ppe = usePpeProductPrices(sewing.products);
  return {
    products: ppe.products,
    pricingError: sewing.pricingError ?? ppe.pricingError,
    reloadPrices: () => {
      sewing.reloadPrices();
      ppe.reloadPrices();
    },
  };
}
