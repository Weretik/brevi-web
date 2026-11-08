import { lazy } from 'react';

import { purchaseInvoicesPath } from './purchasing-paths';

import type { RouteObject } from 'react-router-dom';

const PurchaseInvoicesPage = lazy(() => import('./pages/purchase-invoices-page'));

/** Director only: the app wraps these routes in its role check. */
export const purchasingRoutes: (RouteObject & { path: string })[] = [
  { path: purchaseInvoicesPath, element: <PurchaseInvoicesPage /> },
];
