import type { SewingPriceCalculation, SewingPublication } from '@admin/products/model';

export interface SewingPricingPanelProps {
  calculation: SewingPriceCalculation | null;
  published: SewingPublication | null;
  canManage: boolean;
  dirty: boolean;
  stale: boolean;
  alreadyPublished: boolean;
  busy: boolean;
  calculationLoading: boolean;
  publicationLoading: boolean;
  calculationError: string | null;
  publicationError: string | null;
  writeError: string | null;
  onCalculate: () => void;
  onPublish: () => void;
  onRetryCalculation: () => void;
  onRetryPublication: () => void;
}
