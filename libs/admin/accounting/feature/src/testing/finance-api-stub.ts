import { vi } from 'vitest';

/** Test data and a fetch stub of the «Бухгалтерія» API for page tests. */
export const balance = {
  legacyMinor: 0,
  currentMinor: 100_000,
  totalMinor: 100_000,
  hasHistory: true,
};

export const financeAccount = (overrides: Record<string, unknown> = {}) => ({
  id: 'a1',
  name: 'Банк',
  type: 'Bank',
  currency: 'UAH',
  iban: '',
  openingMinor: 0,
  openingDate: '2024-01-01',
  cutoverBalanceMinor: 100_000,
  cutoverConfirmed: true,
  cutoverConfirmedAt: '2026-11-05T08:00:00+00:00',
  cutoverConfirmedBy: 'director@brevi.com.ua',
  note: '',
  active: true,
  sortOrder: 10,
  version: 1,
  createdAt: '2026-11-05T08:00:00+00:00',
  updatedAt: '2026-11-05T08:00:00+00:00',
  balance,
  ...overrides,
});

export const financeCategory = (overrides: Record<string, unknown> = {}) => ({
  id: 'c1',
  name: 'Матеріали',
  direction: 'Expense',
  scope: 'Current',
  parentId: null,
  note: '',
  active: true,
  sortOrder: 10,
  version: 1,
  ...overrides,
});

export const financeTransaction = (overrides: Record<string, unknown> = {}) => ({
  id: 't1',
  date: '2026-10-15',
  type: 'Expense',
  accountId: 'a1',
  accountName: 'Банк',
  amountMinor: 30_000,
  currency: 'UAH',
  categoryId: 'c2',
  categoryRootId: 'c1',
  categoryRootName: 'Матеріали',
  subcategoryName: 'Тканини',
  counterparty: null,
  oneoffName: '',
  description: 'Нитки',
  comment: '',
  source: 'Manual',
  verification: 'Verified',
  scope: 'Current',
  status: 'Active',
  version: 2,
  createdBy: 'director@brevi.com.ua',
  createdAt: '2026-11-05T08:00:00+00:00',
  updatedAt: '2026-11-05T08:00:00+00:00',
  ...overrides,
});

export const financeTransfer = (overrides: Record<string, unknown> = {}) => ({
  id: 'tr1',
  date: '2026-10-20',
  fromAccountId: 'a1',
  fromAccountName: 'Банк',
  toAccountId: 'a2',
  toAccountName: 'Каса',
  amountMinor: 100_000,
  currency: 'UAH',
  note: 'Зняття готівки',
  source: 'Manual',
  scope: 'Current',
  status: 'Active',
  version: 1,
  createdBy: 'director@brevi.com.ua',
  createdAt: '2026-11-05T08:00:00+00:00',
  updatedAt: '2026-11-05T08:00:00+00:00',
  ...overrides,
});

export const financeCounterparty = (overrides: Record<string, unknown> = {}) => ({
  id: 'f1',
  name: 'ФОП Іваненко',
  edrpou: '12345678',
  iban: '',
  bankName: '',
  aliases: [],
  defaultCategoryId: null,
  defaultCategoryRootName: null,
  defaultSubcategoryName: null,
  autoApplyCategory: false,
  note: '',
  verified: false,
  active: true,
  mergedIntoId: null,
  operationCount: 1,
  currentTurnoverMinor: 0,
  version: 1,
  createdAt: '2026-11-05T08:00:00+00:00',
  updatedAt: '2026-11-05T08:00:00+00:00',
  ...overrides,
});

export const financeAttachment = (overrides: Record<string, unknown> = {}) => ({
  id: 'f1',
  transactionId: 't1',
  fileName: 'Рахунок 12.pdf',
  contentType: 'application/pdf',
  sizeBytes: 250 * 1024,
  createdBy: 'director@brevi.com.ua',
  createdAt: '2026-11-05T08:00:00+00:00',
  ...overrides,
});

export const bankStatement = (overrides: Record<string, unknown> = {}) => ({
  id: 's1',
  accountId: 'a1',
  accountName: 'Банк',
  fileName: 'Виписка жовтень.xlsx',
  status: 'Preview',
  lineCount: 2,
  firstDate: '2026-10-01',
  lastDate: '2026-10-31',
  transactionCount: 0,
  transferCount: 0,
  createdBy: 'director@brevi.com.ua',
  createdAt: '2026-11-08T08:00:00+00:00',
  bookedBy: null,
  bookedAt: null,
  version: 1,
  existing: false,
  ...overrides,
});

export const bankStatementLine = (overrides: Record<string, unknown> = {}) => ({
  id: 'l1',
  rowNumber: 2,
  date: '2026-10-15',
  time: '10:15:00',
  type: 'Expense',
  amountMinor: 125_040,
  currency: 'UAH',
  bankName: 'ТОВ Тканини',
  edrpou: '12345678',
  iban: 'UA213223130000026007233566001',
  purpose: 'Оплата за тканину згідно рах. 15',
  document: '15',
  bankId: null,
  error: '',
  duplicate: 'None',
  duplicateNote: '',
  transferAccountId: null,
  transferAccountName: null,
  counterparty: null,
  categoryId: null,
  categoryRootId: null,
  categoryRootName: null,
  subcategoryName: null,
  oneoffName: '',
  description: '',
  comment: '',
  excluded: false,
  state: 'NewCounterparty',
  willBook: true,
  transactionId: null,
  transferId: null,
  ...overrides,
});

/** JSON of most writes; a file upload stays as sent (multipart text or FormData). */
function readBody(body: BodyInit): unknown {
  if (typeof body !== 'string') return body;
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

/** A statement page from its lines: counts by state and the totals of lines that will be booked. */
export function statementDetails(lines: unknown[], statement = bankStatement()) {
  const rows = lines as {
    state: string;
    willBook: boolean;
    type: string;
    amountMinor: number;
    transferAccountId: string | null;
  }[];
  const states = [...new Set(rows.map((row) => row.state))].map((state) => ({
    state,
    count: rows.filter((row) => row.state === state).length,
  }));
  const booked = rows.filter((row) => row.willBook);
  const operations = booked.filter((row) => !row.transferAccountId);
  const sum = (type: string) =>
    operations
      .filter((row) => row.type === type)
      .reduce((total, row) => total + row.amountMinor, 0);
  return {
    statement,
    states,
    totals: {
      operations: operations.length,
      incomeMinor: sum('Income'),
      expenseMinor: sum('Expense'),
      transfers: booked.length - operations.length,
    },
    lines,
    total: lines.length,
    page: 1,
    pageSize: 100,
  };
}

export interface StubCall {
  method: string;
  path: string;
  body: unknown;
}

/**
 * Answers every «Бухгалтерія» GET from `data`; a write is recorded and answered with `written`.
 * Every request is kept in `calls`.
 */
export function stubFinanceApi(data: {
  accounts?: unknown[];
  categories?: unknown[];
  transactions?: unknown[];
  transactionTotals?: unknown[];
  transfers?: unknown[];
  overview?: unknown;
  counterparties?: unknown[];
  parties?: unknown[];
  oneoffs?: unknown[];
  choices?: unknown[];
  attachments?: unknown[];
  statements?: unknown[];
  /** The statement page: its lines and counts by state; built from `lines` when left out. */
  statementDetails?: unknown;
  lines?: unknown[];
  written?: (call: StubCall) => unknown;
}) {
  const calls: StubCall[] = [];
  const fetcher = vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
    const method = init?.method ?? 'GET';
    const body = init?.body ? readBody(init.body) : null;
    calls.push({ method, path, body });
    const json = (value: unknown) => ({ ok: true, json: async () => value });
    if (method !== 'GET') return json(data.written?.({ method, path, body }) ?? body);
    if (path.startsWith('/api/accounting/settings'))
      return json({ cutoverDate: '2026-10-01', timeZone: 'Europe/Kyiv', today: '2026-11-05' });
    if (path.includes('/history')) return json([]);
    if (path.startsWith('/api/accounting/accounts'))
      return json(data.accounts ?? [financeAccount()]);
    if (path.startsWith('/api/accounting/categories')) return json(data.categories ?? []);
    if (path.startsWith('/api/accounting/overview')) return json(data.overview);
    if (path.startsWith('/api/accounting/counterparties/choices')) return json(data.choices ?? []);
    if (path.startsWith('/api/accounting/counterparties')) {
      const tab = new URLSearchParams(path.split('?')[1]).get('tab') ?? 'Financial';
      const financial = data.counterparties ?? [];
      const parties = data.parties ?? [];
      const oneoffs = data.oneoffs ?? [];
      const rows = { Financial: financial, Oneoffs: oneoffs }[tab] ?? parties;
      return json({
        tab,
        financial: tab === 'Financial' ? financial : [],
        parties: tab === 'Clients' || tab === 'Suppliers' ? parties : [],
        oneoffs: tab === 'Oneoffs' ? oneoffs : [],
        total: rows.length,
        page: 1,
        pageSize: 50,
        counts: {
          financial: financial.length,
          clients: tab === 'Clients' ? parties.length : 0,
          suppliers: tab === 'Suppliers' ? parties.length : 0,
          oneoffs: oneoffs.length,
        },
      });
    }
    if (path.includes('/attachments')) return json(data.attachments ?? []);
    if (path.startsWith('/api/accounting/statements/'))
      return json(data.statementDetails ?? statementDetails(data.lines ?? [bankStatementLine()]));
    if (path.startsWith('/api/accounting/statements')) return json(data.statements ?? []);
    const page = (items: unknown[], totals: unknown[]) =>
      json({ items, total: items.length, page: 1, pageSize: 50, totals });
    if (path.startsWith('/api/accounting/transactions'))
      return page(data.transactions ?? [], data.transactionTotals ?? []);
    if (path.startsWith('/api/accounting/transfers'))
      return page(data.transfers ?? [], [{ currency: 'UAH', amountMinor: 100_000 }]);
    return { ok: false, status: 404, json: async () => ({}) };
  });
  vi.stubGlobal('fetch', fetcher);
  return calls;
}

/** GET requests to one path, with their query strings. */
export const requestsTo = (calls: StubCall[], path: string) =>
  calls
    .filter((call) => call.method === 'GET' && call.path.startsWith(path))
    .map((call) => call.path);
