import type { PpePriceTiers } from '../ppe-pricing/ppe-price-tiers';

/** PPE card (CAT-008): supplier fields of the sheet tab «ЗІЗ» and the live three prices. */
export interface PpeSupplierOffer {
  productId: number;
  unit: string | null;
  supplierId: number | null;
  supplierName: string | null;
  supplierSku: string | null;
  supplierUrl: string | null;
  supplierPrice: number | null;
  /** «Дозволити ручну ціну»: the supplier price job does not overwrite the price. */
  allowManualPrice: boolean;
  ruleCode: string | null;
  insightWholesale: number | null;
  insightRetail: number | null;
  offerVersionId: string | null;
  priceUpdatedAt: string | null;
  prices: PpePriceTiers | null;
  blockers: string[];
}
