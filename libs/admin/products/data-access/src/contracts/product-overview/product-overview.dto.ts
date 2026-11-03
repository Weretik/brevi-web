import type { operations } from '@admin/shared/contracts';

export type ProductOverviewResponse =
  operations['getProductOverview']['responses'][200]['content']['application/json'];
export type UpdateProductOverviewBody =
  operations['updateProductOverview']['requestBody']['content']['application/json'];
