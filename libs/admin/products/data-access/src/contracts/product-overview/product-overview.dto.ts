import type { components, operations } from '@admin/shared/contracts';

export type ProductOverviewPageResponse =
  operations['getProductOverview']['responses'][200]['content']['application/json'];
export type ProductOverviewItemResponse = components['schemas']['ProductOverviewItem'];
export type UpdateProductOverviewBody =
  operations['updateProductOverview']['requestBody']['content']['application/json'];
