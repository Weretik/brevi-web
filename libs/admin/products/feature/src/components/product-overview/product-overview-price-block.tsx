import { ProductOverviewPricePanel } from '@admin/products/ui';

import { useProductPanelPrices } from '../../hooks/product-overview/use-product-panel-prices';

import type { ProductOverview, ProductOverviewPrices } from '@admin/products/model';

interface Props {
  row: ProductOverview;
  prices: ProductOverviewPrices | null;
  onRecalculate?: () => void;
  recalculating?: boolean;
}

/** The price block of the «Товари» side panel, loading the model's costs or the PPE offer. */
export function ProductOverviewPriceBlock({ row, prices, onRecalculate, recalculating }: Props) {
  const panel = useProductPanelPrices(row, prices);
  return (
    <ProductOverviewPricePanel
      {...panel}
      onRecalculate={onRecalculate}
      recalculating={recalculating}
    />
  );
}
