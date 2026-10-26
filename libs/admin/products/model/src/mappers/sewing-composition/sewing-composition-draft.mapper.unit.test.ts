import { describe, expect, it } from 'vitest';

import { sewingCompositionToDraft } from './sewing-composition-draft.mapper';

describe('Effective composition draft mapping', () => {
  it('splits effective shared and Article material lines without copying either scope', () => {
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
          required: true,
          sortOrder: 0,
          reviewed: true,
          reviewedBy: 'actor',
          reviewedAt: null,
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
          required: true,
          sortOrder: 0,
          reviewed: true,
          reviewedBy: 'actor',
          reviewedAt: null,
        },
      ],
      operations: [
        {
          id: 3,
          operationId: 11,
          quantity: 2,
          manualMinutes: null,
          sortOrder: 0,
          reviewed: true,
          reviewedBy: 'actor',
          reviewedAt: null,
        },
      ],
      blockers: [],
    });

    expect(draft.modelMaterials.map((item) => item.referenceId)).toEqual([7]);
    expect(draft.articleMaterials.map((item) => item.referenceId)).toEqual([9]);
    expect(draft.modelMaterials).toHaveLength(1);
    expect(draft.articleMaterials).toHaveLength(1);
    expect(draft.operations).toHaveLength(1);
    expect(draft.articleMaterials[0]?.clientId).toBe('material-2');
  });
});
