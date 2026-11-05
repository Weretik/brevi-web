import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const FinanceAccountsPage = lazy(() => import('./pages/accounts/finance-accounts-page'));
const FinanceCategoriesPage = lazy(() => import('./pages/categories/finance-categories-page'));
const FinanceOverviewPage = lazy(() => import('./pages/overview/finance-overview-page'));
const FinanceTransactionsPage = lazy(
  () => import('./pages/transactions/finance-transactions-page'),
);
const FinanceTransfersPage = lazy(() => import('./pages/transfers/finance-transfers-page'));

export const financeAccountsPath = '/accounting/accounts';
export const financeCategoriesPath = '/accounting/categories';
export const financeOverviewPath = '/accounting/overview';
export const financeTransactionsPath = '/accounting/transactions';
export const financeTransfersPath = '/accounting/transfers';

/** Director only: the app wraps these routes in its role check (ACC-001). */
export const accountingRoutes: (RouteObject & { path: string })[] = [
  { path: financeOverviewPath, element: <FinanceOverviewPage /> },
  { path: financeTransactionsPath, element: <FinanceTransactionsPage /> },
  { path: financeTransfersPath, element: <FinanceTransfersPage /> },
  { path: financeAccountsPath, element: <FinanceAccountsPage /> },
  { path: financeCategoriesPath, element: <FinanceCategoriesPage /> },
];
