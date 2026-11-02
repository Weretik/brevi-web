import { describe, expect, it } from 'vitest';

import { parseSuppliersResponse } from './suppliers-response';

const supplier = {
  id: 1,
  name: 'Атлас',
  link: null,
  contactPerson: null,
  phoneNumber: null,
  notes: null,
};

describe('supplier response validation', () => {
  it.each([null, undefined, {}, { id: 1 }])('rejects a non-list payload: %j', (value) => {
    expect(() => parseSuppliersResponse(value)).toThrow(
      'Некоректна відповідь списку постачальників.',
    );
  });

  it.each([
    null,
    42,
    { ...supplier, id: '1' },
    { ...supplier, id: -1 },
    { ...supplier, id: 1.5 },
    { ...supplier, name: null },
  ])('rejects an invalid row: %j', (value) => {
    expect(() => parseSuppliersResponse([value])).toThrow('Некоректний запис постачальника.');
  });

  it.each(['link', 'contactPerson', 'phoneNumber', 'notes'])(
    'validates nullable field %s before mapping',
    (field) => {
      expect(() => parseSuppliersResponse([{ ...supplier, [field]: 123 }])).toThrow();
      expect(() => parseSuppliersResponse([{ ...supplier, [field]: undefined }])).toThrow();
    },
  );

  it('accepts empty lists, nullable fields, and populated contacts', () => {
    expect(parseSuppliersResponse([])).toEqual([]);
    const populated = {
      ...supplier,
      link: 'supplier.example',
      contactPerson: 'Олена',
      phoneNumber: '+380 XX XXX XX XX',
      notes: 'Тканини',
    };
    expect(parseSuppliersResponse([supplier, populated])).toEqual([supplier, populated]);
  });
});
