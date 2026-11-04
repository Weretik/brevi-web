import { describe, expect, it } from 'vitest';

import { sewingCardToDraft } from './sewing-card-draft.mapper';

describe('sewing card draft', () => {
  it('keeps the shared lines in order with keys of the saved lines', () => {
    const draft = sewingCardToDraft({
      productId: 42,
      modelCode: 'MOD-025',
      version: 3,
      calculatedAt: '2026-11-04T10:00:00Z',
      articles: [],
      materials: [
        {
          id: 2,
          kind: 'OtherCost',
          referenceId: null,
          costCode: 'Пакування',
          name: null,
          unitPrice: null,
          quantity: 1,
          unit: 'Service',
          sortOrder: 1,
          comment: '',
        },
        {
          id: 1,
          kind: 'Accessory',
          referenceId: 10,
          costCode: null,
          name: 'Ґудзик',
          unitPrice: 1.5,
          quantity: 4,
          unit: 'Piece',
          sortOrder: 0,
          comment: '',
        },
      ],
      operations: [
        {
          id: 3,
          operationId: 7,
          name: 'Комір',
          normMinutes: 7.3,
          quantity: 2,
          manualMinutes: null,
          sortOrder: 0,
          comment: 'Комір',
        },
      ],
    });
    expect(draft.version).toBe(3);
    expect(draft.modelMaterials.map((line) => line.clientId)).toEqual(['material-1', 'material-2']);
    expect(draft.operations[0]).toEqual({
      clientId: 'operation-3',
      operationId: 7,
      quantity: 2,
      manualMinutes: null,
      sortOrder: 0,
      comment: 'Комір',
    });
  });
});
