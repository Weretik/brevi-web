import { apiUrl } from '@admin/util/api-url';

import { GarmentPartApiError, readGarmentPartError } from './garment-parts.error';
import { mapGarmentParts } from './garment-parts.mapper';

import type { GarmentPart } from './garment-parts.model';
import type { operations } from '@admin/api-contract';

type CreateBody = operations['createGarmentPart']['requestBody']['content']['application/json'];
type UpdateBody = operations['updateGarmentPart']['requestBody']['content']['application/json'];

const endpoint = '/api/reference/garment-parts';

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
    throw new GarmentPartApiError(0, {});
  }
  if (!response.ok) throw await readGarmentPartError(response);
  return response;
}

export async function listGarmentParts(
  signal?: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<GarmentPart[]> {
  let response: Response;
  try {
    response = await send(endpoint, { signal }, fetcher);
  } catch (error) {
    if (error instanceof GarmentPartApiError && error.status === 404) return [];
    throw error;
  }
  const payload: unknown = await response.json().catch(() => {
    throw new Error('Некоректна відповідь списку елементів виробу.');
  });
  return mapGarmentParts(payload);
}

export async function createGarmentPart(
  body: CreateBody,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  await send(
    endpoint,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    fetcher,
  );
}

export async function updateGarmentPart(
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

export async function deleteGarmentPart(id: number, fetcher: typeof fetch = fetch): Promise<void> {
  await send(`${endpoint}/${id}`, { method: 'DELETE' }, fetcher);
}
