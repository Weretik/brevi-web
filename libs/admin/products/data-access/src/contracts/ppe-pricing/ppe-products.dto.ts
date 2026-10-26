import type { operations } from '@admin/shared/contracts';

export type PpeProductsDto =
  operations['getPpeProductPrices']['responses'][200]['content']['application/json'];
