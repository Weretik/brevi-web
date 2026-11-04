import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const CustomerDetailPage = lazy(() => import('./pages/customers/detail/customer-detail-page'));

export const clientsRoutes = [
  {
    path: '/crm/clients',
    element: <Navigate to="/references/counterparties?tab=clients" replace />,
  },
  {
    path: '/crm/clients/new',
    element: <Navigate to="/references/counterparties?tab=clients" replace />,
  },
  { path: '/crm/clients/:customerId', element: <CustomerDetailPage /> },
] as const;
