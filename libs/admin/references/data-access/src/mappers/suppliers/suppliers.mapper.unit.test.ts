import { describe, expect, it } from 'vitest';

import { mapSuppliers } from './suppliers.mapper';

describe('supplier response mapping', () => {
  it('keeps a valid empty or populated list', () => {
    expect(mapSuppliers([])).toEqual([]);
    expect(
      mapSuppliers([
        { id: 1, name: 'Acme', link: null, contactPerson: null, phoneNumber: null, notes: null },
      ]),
    ).toEqual([
      { id: 1, name: 'Acme', link: null, contactPerson: null, phoneNumber: null, notes: null },
    ]);
  });
});
