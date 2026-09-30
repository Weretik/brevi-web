import { apiUrl } from '@admin/util/api-url';

import {
  GarmentPartOperationApiError,
  readGarmentPartOperationError,
} from './garment-part-operations.error';
import { mapGarmentPartOperations } from './garment-part-operations.mapper';

import type { GarmentPartOperation } from './garment-part-operations.model';
import type { operations } from '@admin/api-contract';

type CreateBody =
  operations['createGarmentPartOperation']['requestBody']['content']['application/json'];
type UpdateBody =
  operations['updateGarmentPartOperation']['requestBody']['content']['application/json'];

const endpoint = '/api/reference/garment-part-operations';

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
    throw new GarmentPartOperationApiError(0, {});
  }
  if (!response.ok) throw await readGarmentPartOperationError(response);
  return response;
}

export async function listGarmentPartOperations(
  signal?: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<GarmentPartOperation[]> {
  let response: Response;
  try {
    response = await send(endpoint, { signal }, fetcher);
  } catch (error) {
    if (error instanceof GarmentPartOperationApiError && error.status === 404) return [];
    throw error;
  }
  const payload: unknown = await response.json().catch(() => {
    throw new Error('Некоректна відповідь списку робіт.');
  });
  return mapGarmentPartOperations(payload);
}

export async function createGarmentPartOperation(
  body: CreateBody,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  await send(
    endpoint,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    fetcher,
  );
}

export async function updateGarmentPartOperation(
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

export async function deleteGarmentPartOperation(
  id: number,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  await send(`${endpoint}/${id}`, { method: 'DELETE' }, fetcher);
}
