import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const FinanceAccountsPage = lazy(() => import('./pages/accounts/finance-accounts-page'));
const FinanceCategoriesPage = lazy(() => import('./pages/categories/finance-categories-page'));

export const financeAccountsPath = '/accounting/accounts';
export const financeCategoriesPath = '/accounting/categories';

/** Director only: the app wraps these routes in its role check (ACC-001). */
export const accountingRoutes: (RouteObject & { path: string })[] = [
  { path: financeAccountsPath, element: <FinanceAccountsPage /> },
  { path: financeCategoriesPath, element: <FinanceCategoriesPage /> },
];
