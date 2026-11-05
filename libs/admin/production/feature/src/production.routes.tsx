import { lazy } from 'react';

import type { ProductionOrderActor } from '@admin/production/model';

const WorkshopStaffPage = lazy(() => import('./pages/staff/workshop-staff-page'));
const FabricNormsPage = lazy(() => import('./pages/norms/fabric-norms-page'));
const PayrollRulesPage = lazy(() => import('./pages/payroll/payroll-rules-page'));
const WorkshopSettingsPage = lazy(() => import('./pages/settings/workshop-settings-page'));
const ProductionOrdersPage = lazy(() => import('./pages/orders/production-orders-page'));
const ProductionOrderCreatePage = lazy(() => import('./pages/orders/production-order-create-page'));
const ProductionOrderPage = lazy(() => import('./pages/orders/production-order-page'));
const FabricStockPage = lazy(() => import('./pages/stock/fabric-stock-page'));
const WorkLogPage = lazy(() => import('./pages/work/work-log-page'));
const SewingForecastPage = lazy(() => import('./pages/forecast/sewing-forecast-page'));
const TimesheetPage = lazy(() => import('./pages/timesheet/timesheet-page'));
const PayrollPage = lazy(() => import('./pages/payroll/payroll-page'));
const WorkshopReportPage = lazy(() => import('./pages/reports/workshop-report-page'));
const WorkshopArchivePage = lazy(() => import('./pages/archive/workshop-archive-page'));

interface ProductionRouteOptions {
  /** The signed-in person: may they import the old «Цех» log. */
  useOrderActor: () => ProductionOrderActor;
}

/** «Швейний цех»; the app puts these pages behind the WorkshopChief or Admin role. */
export function createProductionRoutes({ useOrderActor }: ProductionRouteOptions) {
  return [
    { path: '/production/staff', element: <WorkshopStaffPage /> },
    { path: '/production/fabric-norms', element: <FabricNormsPage /> },
    { path: '/production/payroll-rules', element: <PayrollRulesPage /> },
    { path: '/production/settings', element: <WorkshopSettingsPage /> },
    { path: '/production/work', element: <WorkLogPage useOrderActor={useOrderActor} /> },
    { path: '/production/timesheet', element: <TimesheetPage /> },
    { path: '/production/payroll', element: <PayrollPage /> },
  ];
}

interface ProductionOrderRouteOptions {
  /** The signed-in person: may they create orders from a КП and import old ones. */
  useOrderActor: () => ProductionOrderActor;
}

/**
 * «Виробничі завдання», «Склад тканин», «Прогноз пошиття» and «Архів цеху»; the app puts them behind Admin, Manager or
 * WorkshopChief. The server still decides what each person may change and which prices they see.
 */
export function createProductionOrderRoutes({ useOrderActor }: ProductionOrderRouteOptions) {
  return [
    { path: '/production/orders', element: <ProductionOrdersPage useOrderActor={useOrderActor} /> },
    {
      path: '/production/orders/new',
      element: <ProductionOrderCreatePage useOrderActor={useOrderActor} />,
    },
    { path: '/production/orders/:id', element: <ProductionOrderPage /> },
    {
      path: '/production/fabric-stock',
      element: <FabricStockPage useOrderActor={useOrderActor} />,
    },
    { path: '/production/forecast', element: <SewingForecastPage /> },
    {
      path: '/production/archive',
      element: <WorkshopArchivePage useOrderActor={useOrderActor} />,
    },
  ];
}

/** «Звіти цеху»; the app puts it behind Admin (the director holds Admin), as the server does. */
export function createProductionReportRoutes() {
  return [{ path: '/production/reports', element: <WorkshopReportPage /> }];
}
