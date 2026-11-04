import { SewingPricingPanel } from '@admin/products/ui';

import { useSewingPricing } from '../../hooks/sewing-pricing/use-sewing-pricing';

interface Props {
  productId: number;
  articleId: number;
}

export function SewingPricingFeature({ productId, articleId }: Props) {
  const pricing = useSewingPricing(productId, articleId);
  return <SewingPricingPanel {...pricing} />;
}
