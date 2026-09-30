import { send, readJson } from './products.http';
import { mapProductDetail, mapProductPage } from './products.mapper';

import type { ProductDetail, ProductDraft, ProductPage, ProductQuery } from './products.model';
import type { operations } from '@admin/api-contract';

type CreateBody = operations['createProduct']['requestBody']['content']['application/json'];
type ReplaceBody = operations['replaceProduct']['requestBody']['content']['application/json'];

const endpoint = '/api/v1/products';

export async function listProducts(
  query: ProductQuery,
  signal?: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<ProductPage> {
  const params = new URLSearchParams();
  for (const [name, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') params.set(name, String(value));
  }
  const response = await send(`${endpoint}?${params}`, { signal }, fetcher);
  return mapProductPage(await readJson(response));
}

export async function getProduct(
  id: number,
  signal?: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<ProductDetail> {
  const response = await send(`${endpoint}/${id}`, { signal }, fetcher);
  return mapProductDetail(await readJson(response));
}

export async function createProduct(
  id: number,
  draft: ProductDraft,
  fetcher: typeof fetch = fetch,
): Promise<ProductDetail> {
  const body: CreateBody = { id, ...draft };
  const response = await send(
    endpoint,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    fetcher,
  );
  return mapProductDetail(await readJson(response));
}

export async function replaceProduct(
  id: number,
  draft: ProductDraft,
  fetcher: typeof fetch = fetch,
): Promise<ProductDetail> {
  const body: ReplaceBody = draft;
  const response = await send(
    `${endpoint}/${id}`,
    { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    fetcher,
  );
  return mapProductDetail(await readJson(response));
}

export async function deleteProduct(id: number, fetcher: typeof fetch = fetch): Promise<void> {
  await send(`${endpoint}/${id}`, { method: 'DELETE' }, fetcher);
}
