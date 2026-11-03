import type { operations } from '@admin/shared/contracts';

export type ProductSectionsResponse =
  operations['getProductSections']['responses'][200]['content']['application/json'];
export type CreateProductSectionBody =
  operations['createProductSection']['requestBody']['content']['application/json'];
export type UpdateProductSectionBody =
  operations['updateProductSection']['requestBody']['content']['application/json'];
