import { entries, number, record } from '../response-validation';

import type { ProductPhotoListResponse } from '../../contracts/product-photos/product-photos.dto';

const isText = (value: unknown) => value === null || typeof value === 'string';

function validPhoto(value: unknown): boolean {
  const row = record(value);
  return (
    number(row['mediaFileId']) &&
    isText(row['fileName']) &&
    isText(row['url']) &&
    isText(row['thumbnailUrl']) &&
    typeof row['isMain'] === 'boolean' &&
    number(row['sortOrder']) &&
    typeof row['missing'] === 'boolean'
  );
}

export function parseProductPhotoList(value: unknown): ProductPhotoListResponse {
  const list = record(value);
  if (!number(list['productId']) || !entries(list['photos'], validPhoto))
    throw new Error('Некоректна відповідь фото товару.');
  return value as ProductPhotoListResponse;
}
