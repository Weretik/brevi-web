export const sharedMaterial = {
  id: 1,
  articleId: null,
  scope: 'Model',
  kind: 'Accessory',
  referenceId: 10,
  costCode: null,
  quantity: 2,
  unit: 'Piece',
  sortOrder: 0,
};
export const compositionResponseFixture = {
  productId: 101,
  articleId: 246,
  modelCode: 'MOD-025',
  version: 4,
  materials: [
    sharedMaterial,
    {
      ...sharedMaterial,
      id: 2,
      articleId: 246,
      scope: 'Article',
      kind: 'Fabric',
      referenceId: 59,
      quantity: 3.6,
      unit: 'Metre',
    },
  ],
  operations: [
    {
      id: 3,
      operationId: 7,
      quantity: 2,
      manualMinutes: null,
      sortOrder: 0,
    },
  ],
  blockers: ['No effective fabric line is configured.'],
};
