import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const FinanceAccountsPage = lazy(() => import('./pages/accounts/finance-accounts-page'));
const FinanceCategoriesPage = lazy(() => import('./pages/categories/finance-categories-page'));
const FinanceCounterpartiesPage = lazy(
  () => import('./pages/counterparties/finance-counterparties-page'),
);
const FinanceOverviewPage = lazy(() => import('./pages/overview/finance-overview-page'));
const FinanceReviewPage = lazy(() => import('./pages/review/finance-review-page'));
const FinanceTransactionsPage = lazy(
  () => import('./pages/transactions/finance-transactions-page'),
);
const FinanceTransfersPage = lazy(() => import('./pages/transfers/finance-transfers-page'));
const BankStatementPage = lazy(() => import('./pages/statements/bank-statement-page'));
const BankStatementsPage = lazy(() => import('./pages/statements/bank-statements-page'));
const LegacyFinanceImportPage = lazy(() => import('./pages/import/legacy-finance-import-page'));
const FinanceReportsPage = lazy(() => import('./pages/reports/finance-reports-page'));
const FinanceAuditPage = lazy(() => import('./pages/audit/finance-audit-page'));

export const bankStatementsPath = '/accounting/statements';
export const bankStatementPath = (id: string) => `${bankStatementsPath}/${encodeURIComponent(id)}`;
export const financeAccountsPath = '/accounting/accounts';
export const financeAuditPath = '/accounting/audit';
export const financeCategoriesPath = '/accounting/categories';
export const financeCounterpartiesPath = '/accounting/counterparties';
export const financeOverviewPath = '/accounting/overview';
export const financeReportsPath = '/accounting/reports';
export const financeReviewPath = '/accounting/review';
export const financeTransactionsPath = '/accounting/transactions';
export const financeTransfersPath = '/accounting/transfers';
export const legacyFinanceImportPath = '/accounting/legacy-import';

/** Director only: the app wraps these routes in its role check (ACC-001). */
export const accountingRoutes: (RouteObject & { path: string })[] = [
  { path: financeOverviewPath, element: <FinanceOverviewPage /> },
  { path: financeTransactionsPath, element: <FinanceTransactionsPage /> },
  { path: financeTransfersPath, element: <FinanceTransfersPage /> },
  { path: financeReviewPath, element: <FinanceReviewPage /> },
  { path: financeCounterpartiesPath, element: <FinanceCounterpartiesPage /> },
  { path: financeAccountsPath, element: <FinanceAccountsPage /> },
  { path: financeCategoriesPath, element: <FinanceCategoriesPage /> },
  { path: bankStatementsPath, element: <BankStatementsPage /> },
  { path: `${bankStatementsPath}/:id`, element: <BankStatementPage /> },
  { path: legacyFinanceImportPath, element: <LegacyFinanceImportPage /> },
  { path: financeReportsPath, element: <FinanceReportsPage /> },
  { path: financeAuditPath, element: <FinanceAuditPage /> },
];
