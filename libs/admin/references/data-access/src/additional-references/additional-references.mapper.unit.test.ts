import { describe, expect, it } from 'vitest';

import { mapAdditionalReferences } from './additional-references.mapper';

describe('additional references response mapping', () => {
  it('rejects malformed rows before they reach the table', () => {
    expect(() => mapAdditionalReferences({ id: 1 })).toThrow();
    expect(() =>
      mapAdditionalReferences([{ id: '1', name: 'Знижка', key: 'discount', value: 5, unit: '%' }]),
    ).toThrow();
    expect(() =>
      mapAdditionalReferences([{ id: 1, name: 'Знижка', key: 'discount', value: '5', unit: '%' }]),
    ).toThrow();
  });

  it('maps an empty collection and a valid row', () => {
    expect(mapAdditionalReferences([])).toEqual([]);
    expect(
      mapAdditionalReferences([{ id: 1, name: 'Знижка', key: 'discount', value: 5, unit: '%' }]),
    ).toEqual([{ id: 1, name: 'Знижка', key: 'discount', value: 5, unit: '%', description: null }]);
  });
});
