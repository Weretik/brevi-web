import type { SewingPriceCalculation, SewingPublication } from '@admin/products/model';

export interface SewingPricingPanelProps {
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
