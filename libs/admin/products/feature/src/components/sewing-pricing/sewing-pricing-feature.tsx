import { SewingPricingPanel } from '@admin/products/ui';

import { useSewingPricing } from '../../hooks/sewing-pricing/use-sewing-pricing';

interface Props {
  productId: number;
  articleId: number;
  compositionVersion: number;
  canManage: boolean;
  dirty: boolean;
}

export function SewingPricingFeature({
  productId,
  articleId,
  compositionVersion,
  canManage,
  dirty,
}: Props) {
  const pricing = useSewingPricing(productId, articleId, compositionVersion);
  return <SewingPricingPanel {...pricing} canManage={canManage} dirty={dirty} />;
}
