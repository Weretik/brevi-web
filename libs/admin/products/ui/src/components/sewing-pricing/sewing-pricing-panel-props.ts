import type { SewingPriceCalculation, SewingPublication } from '@admin/products/model';

export interface SewingPricingPanelProps {
  /** The calculation behind the published price: its cost breakdown. */
  calculation: SewingPriceCalculation | null;
  published: SewingPublication | null;
  /** The composition has unsaved changes: the price follows only after saving. */
  dirty: boolean;
  calculationLoading: boolean;
  publicationLoading: boolean;
  calculationError: string | null;
  publicationError: string | null;
  onRetryCalculation: () => void;
  onRetryPublication: () => void;
}
