import { lazy } from 'react';

const WorkshopStaffPage = lazy(() => import('./pages/staff/workshop-staff-page'));
const FabricNormsPage = lazy(() => import('./pages/norms/fabric-norms-page'));
const PayrollRulesPage = lazy(() => import('./pages/payroll/payroll-rules-page'));

/** «Швейний цех»; the app puts these pages behind the WorkshopChief or Admin role. */
export const productionRoutes = [
  { path: '/production/staff', element: <WorkshopStaffPage /> },
  { path: '/production/fabric-norms', element: <FabricNormsPage /> },
  { path: '/production/payroll-rules', element: <PayrollRulesPage /> },
];
