import { readJson, send } from './products.http';
import { mapProductCategories } from './products.mapper';

import type { ProductCategory } from './products.model';

export async function listProductCategories(
  signal?: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<ProductCategory[]> {
  const response = await send('/api/reference/product-categories/admin', { signal }, fetcher);
  return mapProductCategories(await readJson(response));
}
