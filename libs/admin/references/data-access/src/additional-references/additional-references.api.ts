import { apiUrl } from '@admin/util/api-url';

import {
  AdditionalReferenceApiError,
  readAdditionalReferenceError,
} from './additional-references.error';
import { mapAdditionalReferences } from './additional-references.mapper';

import type { AdditionalReference } from './additional-references.model';
import type { operations } from '@admin/api-contract';

type UpdateBody =
  operations['updateAdditionalReference']['requestBody']['content']['application/json'];
const endpoint = '/api/reference/additional-references';

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
    throw new AdditionalReferenceApiError(0, {});
  }
  if (!response.ok) throw await readAdditionalReferenceError(response);
  return response;
}

export async function listAdditionalReferences(
  signal?: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<AdditionalReference[]> {
  let response: Response;
  try {
    response = await send(endpoint, { signal }, fetcher);
  } catch (error) {
    if (error instanceof AdditionalReferenceApiError && error.status === 404) return [];
    throw error;
  }
  const payload: unknown = await response.json().catch(() => {
    throw new Error('Некоректна відповідь списку додаткових довідників.');
  });
  return mapAdditionalReferences(payload);
}

export async function updateAdditionalReference(
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
