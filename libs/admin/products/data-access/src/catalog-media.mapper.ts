import { number, record } from './response-validation';

import type { ProductMedia } from './products.model';

export function mapProductMedia(value: unknown): ProductMedia[] {
  if (!Array.isArray(value)) throw new Error('Некоректний список медіа.');
  return value.map((item) => {
    const row = record(item);
    if (
      !number(row['id']) ||
      !Number.isInteger(row['id']) ||
      row['id'] < 1 ||
      typeof row['originalFileName'] !== 'string' ||
      !row['originalFileName'].trim() ||
      typeof row['publicUrl'] !== 'string' ||
      !row['publicUrl'].trim() ||
      typeof row['contentType'] !== 'string' ||
      !row['contentType'].trim() ||
      (row['status'] !== 'PendingUpload' && row['status'] !== 'Ready')
    )
      throw new Error('Некоректне медіа.');
    return {
      id: row['id'],
      originalFileName: row['originalFileName'],
      publicUrl: row['publicUrl'],
      contentType: row['contentType'],
      status: row['status'],
    };
  });
}
