import { describe, expect, it } from 'vitest';

import { mapGarmentParts } from './garment-parts.mapper';

describe('garment parts response mapping', () => {
  it('rejects malformed rows before they reach the table', () => {
    expect(() => mapGarmentParts({ id: 1 })).toThrow();
    expect(() => mapGarmentParts([{ id: '1', name: 'Рукав' }])).toThrow();
    expect(() => mapGarmentParts([{ id: 1, name: null }])).toThrow();
  });

  it('maps empty and populated lists', () => {
    expect(mapGarmentParts([])).toEqual([]);
    expect(mapGarmentParts([{ id: 1, name: 'Рукав' }])).toEqual([{ id: 1, name: 'Рукав' }]);
  });
});
