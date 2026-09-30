import { apiUrl } from '@admin/util/api-url';

import { GarmentAccessoryApiError, readGarmentAccessoryError } from './garment-accessories.error';
import { mapGarmentAccessories } from './garment-accessories.mapper';

import type { GarmentAccessory } from './garment-accessories.model';
import type { operations } from '@admin/api-contract';

type CreateBody =
  operations['createGarmentAccessory']['requestBody']['content']['application/json'];
type UpdateBody =
  operations['updateGarmentAccessory']['requestBody']['content']['application/json'];

const endpoint = '/api/reference/garment-accessories';

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
    throw new GarmentAccessoryApiError(0, {});
  }
  if (!response.ok) throw await readGarmentAccessoryError(response);
  return response;
}

export async function listGarmentAccessories(
  signal?: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<GarmentAccessory[]> {
  let response: Response;
  try {
    response = await send(endpoint, { signal }, fetcher);
  } catch (error) {
    // The current backend returns NotFound when its unpaged collection is empty.
    if (error instanceof GarmentAccessoryApiError && error.status === 404) return [];
    throw error;
  }
  const payload: unknown = await response.json().catch(() => {
    throw new Error('Некоректна відповідь списку фурнітури.');
  });
  return mapGarmentAccessories(payload);
}

export async function createGarmentAccessory(
  body: CreateBody,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  await send(
    endpoint,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    fetcher,
  );
}

export async function updateGarmentAccessory(
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

export async function deleteGarmentAccessory(
  id: number,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  await send(`${endpoint}/${id}`, { method: 'DELETE' }, fetcher);
}
