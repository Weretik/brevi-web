import { parsePpeSupplierPrice } from '../../validators/ppe-card/ppe-supplier-offer-validation';

import type { PpeSupplierOffer } from '../../entities/ppe-card/ppe-supplier-offer';
import type { PpeSupplierOfferFormValues } from '../../validators/ppe-card/ppe-supplier-offer-validation';

export function createPpeSupplierOfferFormValues(
  offer: PpeSupplierOffer,
): PpeSupplierOfferFormValues {
  return {
    supplierId: offer.supplierId ?? '',
    supplierSku: offer.supplierSku ?? '',
    supplierUrl: offer.supplierUrl ?? '',
    supplierPrice: offer.supplierPrice === null ? '' : String(offer.supplierPrice),
    allowManualPrice: offer.allowManualPrice,
    ruleCode: offer.ruleCode ?? '',
    unit: offer.unit ?? '',
  };
}

/** Request body of `PUT /api/v1/products/{id}/ppe-offer`; call it only for valid values. */
export function ppeSupplierOfferBody(values: PpeSupplierOfferFormValues, offer: PpeSupplierOffer) {
  return {
    supplierId: values.supplierId === '' ? 0 : values.supplierId,
    supplierSku: values.supplierSku.trim() || null,
    supplierUrl: values.supplierUrl.trim() || null,
    supplierPrice: parsePpeSupplierPrice(values.supplierPrice),
    allowManualPrice: values.allowManualPrice,
    ruleCode: values.ruleCode.trim() || null,
    unit: values.unit.trim() || null,
    expectedOfferVersionId: offer.offerVersionId,
  };
}
