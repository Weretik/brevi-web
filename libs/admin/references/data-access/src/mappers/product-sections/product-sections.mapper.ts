import type { ProductSectionsResponse } from '../../contracts/product-sections/product-sections-response';
import type { ProductSection } from '@admin/references/model';

export function mapProductSections(value: ProductSectionsResponse): ProductSection[] {
  return value.map((row) => ({
    id: row.id,
    type: row.type,
    name: row.name,
    isActive: row.isActive,
    comment: row.comment ?? null,
    sortOrder: row.sortOrder,
  }));
}
