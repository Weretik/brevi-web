export const introductionId = '11111111-1111-4111-8111-111111111111';
export const introductionVersionId = '22222222-2222-4222-8222-222222222222';
export const introductionSelections = () =>
  Array.from({ length: 4 }, (_, i) => ({
    slot: { season: 0, position: i, uid: 100 + i },
    productId: 10 + i,
    articleId: 20 + i,
  }));
export const introductionDetailFixture = () => ({
  templatePublicId: introductionId,
  ownerId: 17,
  revision: 3,
  archived: false,
  versionPublicId: introductionVersionId,
  versionNumber: 2,
  name: 'Знайомство',
  updatedAt: '2026-10-30T10:00:00Z',
  snapshot: {
    layout: 1,
    mappingVersionId: introductionId,
    emailTemplateVersionId: introductionVersionId,
    selections: introductionSelections(),
  },
});
export const introductionPreparedFixture = () => ({
  layout: 1,
  mappingVersionId: introductionId,
  emailTemplateVersionId: introductionVersionId,
  slots: introductionSelections().map((selection) => ({
    selection,
    modelName: 'Модель',
    fabricName: 'Тканина',
    fabricComposition: 'Бавовна',
    fabricDensity: '220 г/м²',
    productUrl: 'https://brevi.com.ua/products/test',
    largeWholesale: 250,
    currentPrice: { privateUnused: 'not projected' },
  })),
});
