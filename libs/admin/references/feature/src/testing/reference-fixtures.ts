/** API rows as BreviERP returns them; tests stub fetch with these. */
type ApiRow = Record<string, unknown>;

export function fabricRow(overrides: ApiRow = {}): ApiRow {
  return {
    id: 4,
    code: 'FAB-004',
    name: 'Льон',
    nameRu: 'Лён',
    providerName: 'Атлас',
    composition: '100% льон',
    compositionRu: '100% лён',
    density: '180',
    price: 25,
    priceUpdatedAt: '2026-08-30',
    isActive: true,
    comment: null,
    proposalDescription: null,
    ...overrides,
  };
}

export function accessoryRow(overrides: ApiRow = {}): ApiRow {
  return {
    id: 3,
    code: 'FUR-003',
    name: 'Ґудзики',
    supplierName: 'Атлас',
    price: 1.85,
    unit: 'шт.',
    priceUpdatedAt: '2026-08-30',
    isActive: true,
    comment: null,
    ...overrides,
  };
}

export function supplierRow(overrides: ApiRow = {}): ApiRow {
  return {
    id: 2,
    name: 'Атлас',
    link: null,
    contactPerson: null,
    phoneNumber: null,
    notes: null,
    email: null,
    purchaseCategories: null,
    tags: null,
    isActive: true,
    keepinCrmId: null,
    keepinSyncedAt: null,
    ...overrides,
  };
}

export function operationRow(overrides: ApiRow = {}): ApiRow {
  return {
    id: 2,
    code: 'OP-001',
    garmentPartName: 'Рукав',
    element: 'Рукав',
    variant: 'Прямий',
    name: 'Рукав куртки: прямий',
    min: 6,
    minutesPerProduct: false,
    normCheckedAt: '2026-08-30',
    isActive: true,
    notes: null,
    ...overrides,
  };
}

/** Sewing settings with the sheet's minute cost (15 652,80 / (22 × 400) ≈ 1,7787 грн). */
export function sewingSettingsResponse(): ApiRow {
  return {
    id: 1,
    revision: 1,
    effectiveFrom: '2026-08-01T00:00:00Z',
    formulaVersion: 'sheet-v1',
    settings: { monthlySalary: 15652.8, workDays: 22, shiftMinutes: 400, assemblyRate: 0.25 },
  };
}

export function pricingParameterRow(overrides: ApiRow = {}): ApiRow {
  return {
    id: 7,
    code: 'ASSEMBLY_RATE',
    group: 'Виробництво',
    name: 'Доплата на збирання виробу',
    value: 0.25,
    unit: '%',
    isCalculated: false,
    updatedOn: '2026-08-30',
    comment: null,
    sortOrder: 7,
    ...overrides,
  };
}

export function ppeMarkupRuleRow(overrides: ApiRow = {}): ApiRow {
  return {
    id: 1,
    name: 'Взуття',
    retailMarkup: 0.45,
    wholesaleMarkup: 0.37,
    largeWholesaleMarkup: 0.3,
    priceNote: null,
    appliesTo: 'Усе робоче взуття',
    sortOrder: 2,
    ...overrides,
  };
}
