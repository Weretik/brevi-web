import { lazy } from 'react';

import type { ProductionOrderActor } from '@admin/production/model';

const WorkshopStaffPage = lazy(() => import('./pages/staff/workshop-staff-page'));
const FabricNormsPage = lazy(() => import('./pages/norms/fabric-norms-page'));
const PayrollRulesPage = lazy(() => import('./pages/payroll/payroll-rules-page'));
const ProductionOrdersPage = lazy(() => import('./pages/orders/production-orders-page'));
const ProductionOrderCreatePage = lazy(() => import('./pages/orders/production-order-create-page'));
const ProductionOrderPage = lazy(() => import('./pages/orders/production-order-page'));

/** «Швейний цех»; the app puts these pages behind the WorkshopChief or Admin role. */
export const productionRoutes = [
  { path: '/production/staff', element: <WorkshopStaffPage /> },
  { path: '/production/fabric-norms', element: <FabricNormsPage /> },
  { path: '/production/payroll-rules', element: <PayrollRulesPage /> },
];

interface ProductionOrderRouteOptions {
  /** The signed-in person: may they create orders from a КП and import old ones. */
  useOrderActor: () => ProductionOrderActor;
}

/**
 * «Виробничі завдання»; the app puts them behind Admin, Manager or WorkshopChief. The server still
 * decides what each person may change and which prices they see.
 */
export function createProductionOrderRoutes({ useOrderActor }: ProductionOrderRouteOptions) {
  return [
    { path: '/production/orders', element: <ProductionOrdersPage useOrderActor={useOrderActor} /> },
    {
      path: '/production/orders/new',
      element: <ProductionOrderCreatePage useOrderActor={useOrderActor} />,
    },
    { path: '/production/orders/:id', element: <ProductionOrderPage /> },
  ];
}
