import type { operations } from '@admin/shared/contracts';

export type PriceSourcesResponse =
  operations['listPpePriceSources']['responses'][200]['content']['application/json'];
export type UpdatePriceSourceBody =
  operations['updatePpePriceSource']['requestBody']['content']['application/json'];
export type PriceImportResponse =
  operations['importPpeSupplierPrices']['responses'][200]['content']['application/json'];
