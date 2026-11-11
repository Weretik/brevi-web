import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import type { RouteObject } from 'react-router-dom';

const FabricMovementsPage = lazy(() => import('./pages/movements/fabric-movements-page'));
const FabricStockPage = lazy(() => import('./pages/stock/fabric-stock-page'));
const FabricOpeningPage = lazy(() => import('./pages/opening/fabric-opening-page'));

export const fabricMovementsPath = '/warehouse/movements';
export const fabricStockPath = '/warehouse/stock';
export const fabricOpeningPath = '/warehouse/opening';

/**
 * «Склад тканин»: its own menu block under «Швейний цех» (WH-001), behind the `fabric-stock`
 * page of «Права доступу». The server decides who records movements and who sees prices.
 */
export function createWarehouseRoutes(): (RouteObject & { path: string })[] {
  return [
    { path: fabricMovementsPath, element: <FabricMovementsPage /> },
    { path: fabricStockPath, element: <FabricStockPage /> },
    { path: fabricOpeningPath, element: <FabricOpeningPage /> },
    // The old address of «Склад тканин» inside «Швейний цех».
    { path: '/production/fabric-stock', element: <Navigate to={fabricStockPath} replace /> },
  ];
}
