import type { ProductSectionsResponse } from '../../contracts/product-sections/product-sections-response';

const isType = (value: unknown) => value === 'Sewing' || value === 'Ppe';

export function parseProductSectionsResponse(value: unknown): ProductSectionsResponse {
  if (!Array.isArray(value)) throw new Error('Некоректна відповідь списку розділів.');
  for (const item of value) {
    const row = (item ?? {}) as Record<string, unknown>;
    if (
      !Number.isInteger(row['id']) ||
      (row['id'] as number) <= 0 ||
      !isType(row['type']) ||
      typeof row['name'] !== 'string' ||
      typeof row['isActive'] !== 'boolean' ||
      !(row['comment'] === null || typeof row['comment'] === 'string') ||
      !Number.isInteger(row['sortOrder'])
    )
      throw new Error('Некоректний запис розділу.');
  }
  return value as ProductSectionsResponse;
}
