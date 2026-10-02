import { number, record } from '../validators/response-validation';

import type { ProductCategory } from '@admin/products/model';

export function mapProductCategories(value: unknown): ProductCategory[] {
  if (!Array.isArray(value)) throw new Error('Некоректний список категорій.');
  return value.map((item) => {
    const row = record(item);
    if (
      !number(row['id']) ||
      typeof row['name'] !== 'string' ||
      typeof row['isActive'] !== 'boolean'
    ) {
      throw new Error('Некоректна категорія товару.');
    }
    return row as unknown as ProductCategory;
  });
}
