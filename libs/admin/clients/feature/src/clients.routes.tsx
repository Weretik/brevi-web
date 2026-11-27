import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import type { RouteObject } from 'react-router-dom';

const CustomerDetailPage = lazy(() => import('./pages/detail/customer-detail-page'));

/** The pages of «Права доступу» a client card's tabs follow (CARD-001). */
export interface CustomerCardAccess {
  /** «КП»: the tab «КП» and «Нова КП». */
  readonly quotes: boolean;
  /** «Виробничі завдання»: the tab «Завдання в цех». */
  readonly productionOrders: boolean;
  /** «Мої завдання»: the tab «Завдання менеджерам». */
  readonly tasks: boolean;
  /** «Ціна вишивки»: the tab «Розрахунки вишивки». */
  readonly embroidery: boolean;
  /** «Бухгалтерія»: the tab «Фінанси». */
  readonly finance: boolean;
}

export interface ClientsRouteOptions {
  /** What the signed-in user may open in a client card. */
  useCardAccess: () => CustomerCardAccess;
}

export function createClientsRoutes({
  useCardAccess,
}: ClientsRouteOptions): (RouteObject & { path: string })[] {
  function CustomerDetail() {
    return <CustomerDetailPage access={useCardAccess()} />;
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
