import { describe, expect, it } from 'vitest';

import { mapGarmentPartOperations } from './garment-part-operations.mapper';

describe('garment part operations mapping', () => {
  it('rejects malformed network rows', () => {
    expect(() => mapGarmentPartOperations({ id: 1 })).toThrow();
    expect(() =>
      mapGarmentPartOperations([{ id: 1, garmentPartName: 'Рукав', name: 'Шов', min: -1 }]),
    ).toThrow();
    expect(() =>
      mapGarmentPartOperations([{ id: '1', garmentPartName: 'Рукав', name: 'Шов', min: 2 }]),
    ).toThrow();
  });

  it('maps empty and valid lists', () => {
    expect(mapGarmentPartOperations([])).toEqual([]);
    expect(
      mapGarmentPartOperations([{ id: 1, garmentPartName: 'Рукав', name: 'Шов', min: 2.5 }]),
    ).toEqual([{ id: 1, garmentPartName: 'Рукав', name: 'Шов', min: 2.5 }]);
  });
});
