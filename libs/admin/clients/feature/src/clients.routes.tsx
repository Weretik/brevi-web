import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import type { RouteObject } from 'react-router-dom';

const CustomerDetailPage = lazy(() => import('./pages/customers/detail/customer-detail-page'));

export interface ClientsRouteOptions {
  /** Whether the signed-in user has the «Бухгалтерія» right: the client card gets «Фінанси». */
  useCanSeeFinance: () => boolean;
}

export function createClientsRoutes({
  useCanSeeFinance,
}: ClientsRouteOptions): (RouteObject & { path: string })[] {
  function CustomerDetail() {
    return <CustomerDetailPage canSeeFinance={useCanSeeFinance()} />;
  }
  return [
    {
      path: '/crm/clients',
      element: <Navigate to="/references/counterparties?tab=clients" replace />,
    },
    {
      path: '/crm/clients/new',
      element: <Navigate to="/references/counterparties?tab=clients" replace />,
    },
    { path: '/crm/clients/:customerId', element: <CustomerDetail /> },
  ];
}
