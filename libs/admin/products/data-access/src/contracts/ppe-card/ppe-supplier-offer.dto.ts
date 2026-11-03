import type { operations } from '@admin/shared/contracts';

export type PpeSupplierOfferDto =
  operations['getPpeSupplierOffer']['responses'][200]['content']['application/json'];
export type UpdatePpeSupplierOfferBody =
  operations['updatePpeSupplierOffer']['requestBody']['content']['application/json'];
