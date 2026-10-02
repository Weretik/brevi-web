import { entries, number, record } from '../validators/response-validation';

import type { Product } from '@admin/products/model';

export function mapProduct(value: unknown): Product {
  const row = record(value);
  if (
    !number(row['id']) ||
    !Number.isInteger(row['id']) ||
    typeof row['name'] !== 'string' ||
    typeof row['slug'] !== 'string' ||
    (row['type'] !== 'Sewing' && row['type'] !== 'Ppe') ||
    !entries(row['categoryIds'], number) ||
    !number(row['minimumWholesalePrice']) ||
    typeof row['createdAtUtc'] !== 'string' ||
    !(row['updatedAtUtc'] === null || typeof row['updatedAtUtc'] === 'string')
  ) {
    throw new Error('Некоректна відповідь товарів.');
  }
  if (row['mainPhoto'] != null) {
    const photo = record(row['mainPhoto']);
    if (!number(photo['mediaFileId']) || typeof photo['url'] !== 'string') {
      throw new Error('Некоректне фото товару.');
    }
  }
  return row as unknown as Product;
}
