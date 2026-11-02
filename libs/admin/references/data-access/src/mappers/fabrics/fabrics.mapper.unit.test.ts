import { describe, expect, it } from 'vitest';

import { mapFabrics } from './fabrics.mapper';
import { parseFabricsResponse } from '../../validators/fabrics/fabrics-response';

const row = {
  id: 4,
  code: 'FAB-004',
  name: 'Льон',
  nameRu: 'Лён',
  providerName: 'Атлас',
  composition: '100% льон',
  compositionRu: null,
  density: '180',
  price: 25,
  priceUpdatedAt: '2026-08-30',
  isActive: true,
  comment: null,
  proposalDescription: null,
};

describe('fabric response mapping', () => {
  it('maps the sheet fields of a valid row', () => {
    expect(mapFabrics(parseFabricsResponse([row]))).toEqual([row]);
  });

  it('rejects a damaged row before it reaches the grid', () => {
    expect(() => parseFabricsResponse([{ ...row, price: '25' }])).toThrow(
      'Некоректний запис тканини.',
    );
    expect(() => parseFabricsResponse([{ ...row, isActive: undefined }])).toThrow(
      'Некоректний запис тканини.',
    );
  });
});
