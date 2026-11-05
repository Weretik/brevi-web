import { SewingPricingPanel } from '@admin/products/ui';

import { useCanSeeCost } from '../../hooks/product-access/use-can-see-cost';
import { useSewingPricing } from '../../hooks/sewing-pricing/use-sewing-pricing';

import type { SewingPricingFabric } from '@admin/products/ui';

interface Props {
  productId: number;
  articleId: number;
  /** The fabric of this variant, shown above its price; null when unknown. */
  fabric?: SewingPricingFabric | null;
}

export function SewingPricingFeature({ productId, articleId, fabric = null }: Props) {
  const pricing = useSewingPricing(productId, articleId);
  const showCost = useCanSeeCost();
  return <SewingPricingPanel {...pricing} fabric={fabric} showCost={showCost} />;
}
