import { SewingPricingPanel } from '@admin/products/ui';

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
  return <SewingPricingPanel {...pricing} fabric={fabric} />;
}
