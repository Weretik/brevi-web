import type { operations } from '@admin/shared/contracts';

export type ProductOverviewPricesResponse =
  operations['getProductOverviewPrices']['responses'][200]['content']['application/json'];
