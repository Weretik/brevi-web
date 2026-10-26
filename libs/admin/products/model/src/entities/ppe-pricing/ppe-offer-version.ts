import type { PpeOfferValues } from './ppe-offer-values';

export interface PpeOfferVersion {
  id: string;
  productId: number;
  values: PpeOfferValues;
  isApproved: boolean;
  approvedAt: string | null;
}
