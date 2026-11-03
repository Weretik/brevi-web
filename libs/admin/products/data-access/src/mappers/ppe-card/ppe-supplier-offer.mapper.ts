import { validatePpeSupplierOffer } from '../../validators/ppe-card/validate-ppe-supplier-offer';
import { ensurePricing } from '../../validators/pricing/pricing-values';

import type { PpeSupplierOffer } from '@admin/products/model';

export function mapPpeSupplierOffer(value: unknown, productId: number): PpeSupplierOffer {
  const dto = validatePpeSupplierOffer(value);
  ensurePricing(dto.productId === productId);
  const prices = dto.calculation.prices;
  return {
    productId: dto.productId,
    unit: dto.unit,
    supplierId: dto.supplierId,
    supplierName: dto.supplierName,
    supplierSku: dto.supplierSku,
    supplierUrl: dto.supplierUrl,
    supplierPrice: dto.supplierPrice,
    allowManualPrice: dto.allowManualPrice,
    ruleCode: dto.ruleCode,
    insightWholesale: dto.insightWholesale,
    insightRetail: dto.insightRetail,
    offerVersionId: dto.offerVersionId,
    priceUpdatedAt: dto.priceUpdatedAt,
    prices: prices
      ? {
          retail: prices.retail,
          wholesale: prices.wholesale,
          largeWholesale: prices.largeWholesale,
        }
      : null,
    blockers: dto.calculation.blockers.map((blocker) => blocker.code),
  };
}
