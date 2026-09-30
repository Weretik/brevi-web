import { apiUrl } from '@admin/util/api-url';

import { FabricApiError, readFabricError } from './fabrics.error';
import { mapFabrics } from './fabrics.mapper';

import type { Fabric } from './fabrics.model';
import type { operations } from '@admin/api-contract';

type CreateBody = operations['createFabric']['requestBody']['content']['application/json'];
type UpdateBody = operations['updateFabric']['requestBody']['content']['application/json'];

const endpoint = '/api/reference/fabrics';

async function send(
  path: string,
  init: RequestInit = {},
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  let response: Response;
  try {
    response = await fetcher(apiUrl(path), { credentials: 'same-origin', ...init });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new FabricApiError(0, {});
  }
  if (!response.ok) throw await readFabricError(response);
  return response;
}

export async function listFabrics(
  signal?: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<Fabric[]> {
  let response: Response;
  try {
    response = await send(endpoint, { signal }, fetcher);
  } catch (error) {
    // The current backend returns NotFound when its unpaged collection is empty.
    if (error instanceof FabricApiError && error.status === 404) return [];
    throw error;
  }
  const payload: unknown = await response.json().catch(() => {
    throw new Error('Некоректна відповідь списку тканин.');
  });
  return mapFabrics(payload);
}

export async function createFabric(body: CreateBody, fetcher: typeof fetch = fetch): Promise<void> {
  await send(
    endpoint,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    fetcher,
  );
}

export async function updateFabric(
  id: number,
  body: UpdateBody,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  await send(
    `${endpoint}/${id}`,
    { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    fetcher,
  );
}

export async function deleteFabric(id: number, fetcher: typeof fetch = fetch): Promise<void> {
  await send(`${endpoint}/${id}`, { method: 'DELETE' }, fetcher);
}
