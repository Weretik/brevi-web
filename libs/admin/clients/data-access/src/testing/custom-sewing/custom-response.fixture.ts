import type { operations } from '@admin/shared/contracts';

type Detail =
  operations['getCrmCustomSewingDraft']['responses'][200]['content']['application/json'];
type Basis = NonNullable<Detail['preview']>;
export const customId = '11111111-1111-4111-8111-111111111111';
export const customVersionId = '22222222-2222-4222-8222-222222222222';
export function customBasisFixture(overrides: Partial<Basis> = {}): Basis {
  return {
    token: customVersionId,
    calculatedAt: '2026-10-28T10:00:00Z',
    expiresAt: '2030-10-28T10:00:00Z',
    formulaVersion: 'custom-sewing-sheet-v1',
    settingsVersionId: 1,
    references: [],
    breakdown: {
      materials: 30,
      otherCosts: 0,
      totalMinutes: 10,
      minuteCost: 1,
      seamstress: 10,
      cutting: 2,
      master: 2,
      manager: 2,
      bonus: 2,
      overhead: 2,
      delivery: 0,
      packaging: 0,
      applicationCost: 0,
      applicationSale: 0,
    },
    internalCost: 50,
    retail: 120,
    wholesale: 100,
    largeWholesale: 80,
    blockers: [],
    isCalculated: true,
    ...overrides,
  };
}
export function customDetailFixture(overrides: Partial<Detail> = {}): Detail {
  return {
    publicId: customId,
    revision: 1,
    ownerId: 17,
    customerPublicId: null,
    quotePublicId: null,
    configuration: {
      name: 'Куртка',
      productType: 'Куртка',
      season: 'winter',
      description: '',
      clientComment: '',
      internalNote: '',
      fabrics: [{ referenceId: 1, quantity: 2, unit: 'Metre' }],
      accessories: [],
      operations: [{ referenceId: 2, quantity: 1, manualMinutes: null }],
      applications: [],
      delivery: 0,
      packaging: 0,
    },
    currentVersion: null,
    preview: null,
    updatedAt: '2026-10-28T10:00:00Z',
    canEdit: true,
    ...overrides,
  };
}
