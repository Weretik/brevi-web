import { lazy } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import type { RouteObject } from 'react-router-dom';

const PricingParametersPage = lazy(
  () => import('./pages/pricing-parameters/pricing-parameters-page'),
);
const PriceImportPage = lazy(() => import('./pages/price-import/price-import-page'));
const MaterialsPage = lazy(() => import('./pages/materials/materials-page'));
const OperationsPage = lazy(() => import('./pages/operations/operations-page'));
const ProductSectionsPage = lazy(() => import('./pages/product-sections/product-sections-page'));
const CounterpartiesPage = lazy(() => import('./pages/counterparties/counterparties-page'));

/** Old separate pages: `/references/garment-accessory` (with `?tab=fabrics` for fabrics). */
function GarmentAccessoriesRedirect() {
  const [searchParams] = useSearchParams();
  return (
    <Navigate
      to={
        searchParams.get('tab') === 'fabrics'
          ? '/references/materials'
          : '/references/materials?tab=accessories'
      }
      replace
    />
  );
}

export interface ReferencesRouteOptions {
  /** Whether the signed-in user may see a supplier's «Рахунки на закупку» (the Director). */
  useCanSeePurchaseInvoices: () => boolean;
  /** Whether the signed-in user has the «Бухгалтерія» right: the supplier card gets «Фінанси». */
  useCanSeeFinance: () => boolean;
}

export function createReferencesRoutes({
  useCanSeePurchaseInvoices,
  useCanSeeFinance,
}: ReferencesRouteOptions): (RouteObject & { path: string })[] {
  function Counterparties() {
    return (
      <CounterpartiesPage
        canSeePurchaseInvoices={useCanSeePurchaseInvoices()}
        canSeeFinance={useCanSeeFinance()}
      />
    );
  }
  return [
    { path: '/references/counterparties', element: <Counterparties /> },
    { path: '/references/supplier', element: <Navigate to="/references/counterparties" replace /> },
    { path: '/references/materials', element: <MaterialsPage /> },
    { path: '/references/fabric', element: <Navigate to="/references/materials" replace /> },
    { path: '/references/garment-accessory', element: <GarmentAccessoriesRedirect /> },
    { path: '/references/garment-part-operation', element: <OperationsPage /> },
    { path: '/references/pricing-parameters', element: <PricingParametersPage /> },
    { path: '/references/price-import', element: <PriceImportPage /> },
    { path: '/references/product-sections', element: <ProductSectionsPage /> },
    {
      path: '/references/additional-reference',
      element: <Navigate to="/references/pricing-parameters" replace />,
    },
  ];
}
