import type { operations } from '@admin/shared/contracts';

export type CreateCatalogProductBody =
  operations['createCatalogProduct']['requestBody']['content']['application/json'];
export type CreatedCatalogProductDto =
  operations['createCatalogProduct']['responses'][201]['content']['application/json'];
export type ProductCodeCheckDto =
  operations['getProductCodeCheck']['responses'][200]['content']['application/json'];
export type PpePricePreviewDto =
  operations['previewPpePrices']['responses'][200]['content']['application/json'];
