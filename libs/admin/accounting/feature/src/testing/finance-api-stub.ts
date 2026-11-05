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
  written?: (call: StubCall) => unknown;
}) {
  const calls: StubCall[] = [];
  const fetcher = vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
    const method = init?.method ?? 'GET';
    const body = init?.body ? JSON.parse(String(init.body)) : null;
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
