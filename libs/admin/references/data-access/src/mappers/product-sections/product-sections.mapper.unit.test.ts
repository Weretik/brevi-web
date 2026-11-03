import { describe, expect, it } from 'vitest';

import { mapProductSections } from './product-sections.mapper';
import { parseProductSectionsResponse } from '../../validators/product-sections/product-sections-response';

describe('product sections response', () => {
  it('maps a valid list', () => {
    const rows = parseProductSectionsResponse([
      { id: 1, type: 'Ppe', name: 'Захист рук', isActive: true, comment: null, sortOrder: 14 },
    ]);
    expect(mapProductSections(rows)).toEqual([
      { id: 1, type: 'Ppe', name: 'Захист рук', isActive: true, comment: null, sortOrder: 14 },
    ]);
  });

  it('rejects an unknown product type', () => {
    expect(() =>
      parseProductSectionsResponse([
        { id: 1, type: 'Shoes', name: 'Взуття', isActive: true, comment: null, sortOrder: 1 },
      ]),
    ).toThrow('Некоректний запис розділу.');
  });
});
