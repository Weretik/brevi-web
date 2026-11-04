import { ProductOverviewPricePanel } from '@admin/products/ui';

import { useProductPanelPrices } from '../../hooks/product-overview/use-product-panel-prices';

import type { ProductOverview } from '@admin/products/model';

interface Props {
  row: ProductOverview;
}

/** The price block of the «Товари» side panel, loading the model's costs or the PPE offer. */
export function ProductOverviewPriceBlock({ row }: Props) {
  const panel = useProductPanelPrices(row);
  return <ProductOverviewPricePanel {...panel} />;
}
