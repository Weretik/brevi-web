import type { SewingPriceCalculation, SewingPublication } from '@admin/products/model';

/** The fabric of the variant whose price is shown (client item 12). */
export interface SewingPricingFabric {
  name: string;
  /** Price of one metre; null when the fabric is not in the reference. */
  pricePerMetre: number | null;
  metres: number | null;
}

export interface SewingPricingPanelProps {
  fabric: SewingPricingFabric | null;
  /** The calculation behind the published price: its cost breakdown. */
  calculation: SewingPriceCalculation | null;
  published: SewingPublication | null;
  calculationLoading: boolean;
  publicationLoading: boolean;
  calculationError: string | null;
  publicationError: string | null;
  onRetryCalculation: () => void;
  onRetryPublication: () => void;
}
