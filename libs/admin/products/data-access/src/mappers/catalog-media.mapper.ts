import { number, record } from '../validators/response-validation';

import type { ProductMedia } from '@admin/products/model';

/** One photo of the photo library (`MediaFileResponse`), as the product editor needs it. */
export function mapProductMedia(value: unknown): ProductMedia {
  const row = record(value);
  if (
    !number(row['id']) ||
    !Number.isInteger(row['id']) ||
    row['id'] < 1 ||
    typeof row['fileName'] !== 'string' ||
    !row['fileName'].trim() ||
    typeof row['publicUrl'] !== 'string' ||
    !row['publicUrl'].trim() ||
    typeof row['contentType'] !== 'string' ||
    !row['contentType'].trim()
  )
    throw new Error('Некоректне медіа.');
  return {
    id: row['id'],
    originalFileName: row['fileName'],
    publicUrl: row['publicUrl'],
    contentType: row['contentType'],
    // The library saves a photo only after the CDN upload, so every photo is ready.
    status: 'Ready',
  };
}

export function mapProductMediaPage(value: unknown): { items: ProductMedia[]; total: number } {
  const page = record(value);
  if (!Array.isArray(page['items']) || !number(page['total']))
    throw new Error('Некоректний список медіа.');
  return { items: page['items'].map(mapProductMedia), total: page['total'] };
}
