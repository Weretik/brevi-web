import { SewingPricingPanel } from '@admin/products/ui';

import { useSewingPricing } from '../../hooks/sewing-pricing/use-sewing-pricing';

interface Props {
  productId: number;
  articleId: number;
  dirty: boolean;
}

export function SewingPricingFeature({ productId, articleId, dirty }: Props) {
  const pricing = useSewingPricing(productId, articleId);
  return <SewingPricingPanel {...pricing} dirty={dirty} />;
}
