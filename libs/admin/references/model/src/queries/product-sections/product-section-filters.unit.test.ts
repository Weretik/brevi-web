import { describe, expect, it } from 'vitest';

import { countProductSectionsByType, filterProductSections } from './product-section-filters';

import type { ProductSection } from '../../entities/product-sections/product-section';

const section = (
  id: number,
  type: ProductSection['type'],
  name: string,
  comment: string | null,
) => ({
  id,
  type,
  name,
  isActive: true,
  comment,
  sortOrder: id,
});

const rows: ProductSection[] = [
  section(1, 'Sewing', 'Одяг ЛІТО', 'Літній одяг'),
  section(2, 'Sewing', 'Одяг ЗИМА', 'Зимовий одяг'),
  section(3, 'Ppe', 'Захист рук', null),
];

describe('product section filters', () => {
  it('counts sections of each product type', () => {
    expect(countProductSectionsByType(rows)).toEqual([
      { type: 'Sewing', count: 2 },
      { type: 'Ppe', count: 1 },
    ]);
  });

  it('filters by type, then searches the name and comment', () => {
    expect(filterProductSections(rows, '', 'Ppe').map((row) => row.id)).toEqual([3]);
    expect(filterProductSections(rows, 'зимов', null).map((row) => row.id)).toEqual([2]);
    expect(filterProductSections(rows, 'одяг', 'Sewing')).toHaveLength(2);
  });
});
