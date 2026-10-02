import { mapProduct } from './product.mapper';
import { number, record } from '../validators/response-validation';

import type { ProductPage } from '@admin/products/model';

export function mapProductPage(value: unknown): ProductPage {
  const payload = record(value);
  const info = record(payload['pagedInfo']);
  if (
    !Array.isArray(payload['value']) ||
    !['pageNumber', 'pageSize', 'totalPages', 'totalRecords'].every(
      (field) =>
        number(info[field]) && Number.isInteger(info[field]) && (info[field] as number) >= 0,
    )
  ) {
    throw new Error('Некоректна сторінка товарів.');
  }
  return { value: payload['value'].map(mapProduct), pagedInfo: info as ProductPage['pagedInfo'] };
}
