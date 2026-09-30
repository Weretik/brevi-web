import { mapProductMedia } from './catalog-media.mapper';
import { readJson, send } from './products.http';

import type { ProductMedia } from './products.model';
import type { operations } from '@admin/api-contract';

type UploadMediaResponse =
  operations['uploadCatalogMedia']['responses'][200]['content']['application/json'];

export async function listProductMedia(
  signal?: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<ProductMedia[]> {
  const response = await send('/api/catalog/media', { signal }, fetcher);
  return mapProductMedia(await readJson(response));
}

export async function uploadProductMedia(
  file: File,
  fetcher: typeof fetch = fetch,
): Promise<number> {
  const body = new FormData();
  body.set('file', file);
  const response = await send('/api/catalog/media', { method: 'POST', body }, fetcher);
  const payload = await readJson(response);
  if (!payload || typeof payload !== 'object')
    throw new Error('Некоректна відповідь завантаження.');
  const media = payload as Record<string, unknown>;
  if (
    typeof media['mediaFileId'] !== 'number' ||
    !Number.isInteger(media['mediaFileId']) ||
    media['mediaFileId'] < 1 ||
    typeof media['storageKey'] !== 'string' ||
    typeof media['publicUrl'] !== 'string' ||
    typeof media['contentType'] !== 'string' ||
    typeof media['originalFileName'] !== 'string'
  )
    throw new Error('Некоректна відповідь завантаження.');
  return (media as UploadMediaResponse).mediaFileId;
}

export async function deleteProductMedia(id: number, fetcher: typeof fetch = fetch): Promise<void> {
  await send(`/api/catalog/media/${id}`, { method: 'DELETE' }, fetcher);
}
