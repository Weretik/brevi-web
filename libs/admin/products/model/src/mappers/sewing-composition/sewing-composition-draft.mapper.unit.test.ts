import { describe, expect, it } from 'vitest';

import { sewingCompositionToDraft } from './sewing-composition-draft.mapper';

describe('Effective composition draft mapping', () => {
  it('keeps only the shared materials: a variant fabric is edited on «Тканини»', () => {
    const draft = sewingCompositionToDraft({
      productId: 42,
      articleId: 501,
      modelCode: 'MOD-025',
      version: 4,
      materials: [
        {
          id: 1,
          articleId: null,
          scope: 'Model',
          kind: 'Accessory',
          referenceId: 7,
          costCode: null,
          quantity: 2,
          unit: 'Piece',
          sortOrder: 0,
        },
        {
          id: 2,
          articleId: 501,
          scope: 'Article',
          kind: 'Fabric',
          referenceId: 9,
          costCode: null,
          quantity: 3.6,
          unit: 'Metre',
          sortOrder: 0,
        },
      ],
      operations: [
        {
          id: 3,
          operationId: 11,
          quantity: 2,
          manualMinutes: null,
          sortOrder: 0,
        },
      ],
      blockers: [],
    });

    expect(draft.modelMaterials.map((item) => item.referenceId)).toEqual([7]);
    expect(draft.modelMaterials[0]?.clientId).toBe('material-1');
    expect(draft.operations).toHaveLength(1);
  });
});
