import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import type { ProductionOrderActor, WorkshopPeopleAccess } from '@admin/production/model';

const WorkshopPeoplePage = lazy(() => import('./pages/people/workshop-people-page'));
const FabricNormsPage = lazy(() => import('./pages/norms/fabric-norms-page'));
const WorkshopSettingsPage = lazy(() => import('./pages/settings/workshop-settings-page'));
const ProductionOrdersPage = lazy(() => import('./pages/orders/production-orders-page'));
const ProductionOrderCreatePage = lazy(() => import('./pages/orders/production-order-create-page'));
const ProductionOrderPage = lazy(() => import('./pages/orders/production-order-page'));
const WorkLogPage = lazy(() => import('./pages/work/work-log-page'));
const SewingForecastPage = lazy(() => import('./pages/forecast/sewing-forecast-page'));
const WorkshopReportPage = lazy(() => import('./pages/reports/workshop-report-page'));
const WorkshopArchivePage = lazy(() => import('./pages/archive/workshop-archive-page'));

interface ProductionRouteOptions {
  /** The signed-in person: may they import the old «Цех» log. */
  useOrderActor: () => ProductionOrderActor;
  /** Tabs of «Персонал цеху» the signed-in person may open. */
  usePeopleAccess: () => WorkshopPeopleAccess;
}

/** «Швейний цех»; the app puts these pages behind the WorkshopChief or Admin role. */
export function createProductionRoutes({ useOrderActor, usePeopleAccess }: ProductionRouteOptions) {
  return [
    { path: '/production/people', element: <WorkshopPeoplePage useAccess={usePeopleAccess} /> },
    // The three pages merged into «Персонал цеху»; the old addresses keep working.
    { path: '/production/staff', element: <Navigate to="/production/people?tab=staff" replace /> },
    {
      path: '/production/timesheet',
      element: <Navigate to="/production/people?tab=timesheet" replace />,
    },
    {
      path: '/production/payroll',
      element: <Navigate to="/production/people?tab=month" replace />,
    },
    { path: '/production/fabric-norms', element: <FabricNormsPage /> },
    {
      path: '/production/payroll-rules',
      element: <Navigate to="/references/pricing-parameters" replace />,
    },
    { path: '/production/settings', element: <WorkshopSettingsPage /> },
    { path: '/production/work', element: <WorkLogPage useOrderActor={useOrderActor} /> },
  ];
}

interface ProductionOrderRouteOptions {
  /** The signed-in person: may they create orders from a КП and import old ones. */
  useOrderActor: () => ProductionOrderActor;
}

/**
 * «Виробничі завдання», «Прогноз пошиття» and «Архів цеху»; the app puts them behind Admin, Manager or
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
