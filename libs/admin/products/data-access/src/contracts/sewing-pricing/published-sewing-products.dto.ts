import type { operations } from '@admin/shared/contracts';

export type PublishedSewingProductsDto =
  operations['getPublishedSewingProducts']['responses'][200]['content']['application/json'];
