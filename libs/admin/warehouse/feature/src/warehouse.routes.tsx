import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import {
  fabricMovementsPath,
  fabricStockPath,
  warehouseReportsPath,
  warehouseToOrderPath,
} from './warehouse-paths';

import type { WarehouseAccess } from '@admin/warehouse/model';
import type { RouteObject } from 'react-router-dom';

const FabricMovementsPage = lazy(() => import('./pages/movements/fabric-movements-page'));
const FabricStockPage = lazy(() => import('./pages/stock/fabric-stock-page'));
const WarehouseToOrderPage = lazy(() => import('./pages/to-order/warehouse-to-order-page'));
const WarehouseReportsPage = lazy(() => import('./pages/reports/warehouse-reports-page'));

export {
  fabricMovementsPath,
  fabricStockPath,
  warehouseReportsPath,
  warehouseToOrderPath,
} from './warehouse-paths';

export interface WarehouseRouteOptions {
  /** The «Права доступу» pages of the tabs of «Що замовити» and «Звіти». */
  useAccess: () => WarehouseAccess;
}

/**
 * «Склад тканин»: its own menu block under «Швейний цех» (WH-001) with four items: «Залишки»,
 * «Рух тканини», «Що замовити» (Тканина · Фурнітура) and «Звіти» (План і факт · Витрата за період ·
 * Вартість). Every tab keeps its own page of «Права доступу»; the old addresses open the right tab.
 */
export function createWarehouseRoutes({
  useAccess,
}: WarehouseRouteOptions): (RouteObject & { path: string })[] {
  return [
    { path: fabricStockPath, element: <FabricStockPage /> },
    { path: fabricMovementsPath, element: <FabricMovementsPage /> },
    { path: warehouseToOrderPath, element: <WarehouseToOrderPage useAccess={useAccess} /> },
    { path: warehouseReportsPath, element: <WarehouseReportsPage useAccess={useAccess} /> },
    // Pages merged on 2026-11-12: the old addresses keep working.
    {
      path: '/warehouse/opening',
      element: <Navigate to={`${fabricMovementsPath}?kind=Opening`} replace />,
    },
    {
      path: '/warehouse/booking',
      element: <Navigate to={`${warehouseToOrderPath}?tab=fabric`} replace />,
    },
    {
      path: '/warehouse/hardware',
      element: <Navigate to={`${warehouseToOrderPath}?tab=hardware`} replace />,
    },
    {
      path: '/warehouse/plan-fact',
      element: <Navigate to={`${warehouseReportsPath}?tab=plan-fact`} replace />,
    },
    {
      path: '/warehouse/valuation',
      element: <Navigate to={`${warehouseReportsPath}?tab=valuation`} replace />,
    },
    // The old address of «Склад тканин» inside «Швейний цех».
    { path: '/production/fabric-stock', element: <Navigate to={fabricStockPath} replace /> },
  ];
}
