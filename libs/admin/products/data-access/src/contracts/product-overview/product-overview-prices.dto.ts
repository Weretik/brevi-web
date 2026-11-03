import type { operations } from '@admin/shared/contracts';

export type ProductOverviewPricesResponse =
  operations['getProductOverviewPrices']['responses'][200]['content']['application/json'];
export type RecalculateSewingPricesBody =
  operations['recalculateSewingPrices']['requestBody']['content']['application/json'];
export type SewingRecalculationReportResponse =
  operations['recalculateSewingPrices']['responses'][200]['content']['application/json'];
