import { describe, expect, it } from 'vitest';

import { mapSuppliers } from './suppliers.mapper';

const row = {
  id: 1,
  name: 'Тексика',
  link: null,
  contactPerson: null,
  phoneNumber: null,
  notes: null,
  email: 'a@teksika.com',
  purchaseCategories: 'тканина',
  tags: 'опт',
  isActive: true,
  keepinCrmId: '104551',
  keepinSyncedAt: '2026-11-02T10:00:00Z',
};

describe('supplier response mapping', () => {
  it('keeps a valid empty or populated list with KeepinCRM and purchasing fields', () => {
    expect(mapSuppliers([])).toEqual([]);
    expect(mapSuppliers([row])).toEqual([row]);
  });
});
