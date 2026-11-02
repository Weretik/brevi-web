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
