import { lazy } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

const PricingParametersPage = lazy(
  () => import('./pages/pricing-parameters/pricing-parameters-page'),
);
const MaterialsPage = lazy(() => import('./pages/materials/materials-page'));
const OperationsPage = lazy(() => import('./pages/operations/operations-page'));
const SuppliersPage = lazy(() => import('./pages/suppliers/suppliers-page'));

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

export const referencesRoutes = [
  { path: '/references/supplier', element: <SuppliersPage /> },
  { path: '/references/materials', element: <MaterialsPage /> },
  { path: '/references/fabric', element: <Navigate to="/references/materials" replace /> },
  { path: '/references/garment-accessory', element: <GarmentAccessoriesRedirect /> },
  { path: '/references/garment-part-operation', element: <OperationsPage /> },
  { path: '/references/pricing-parameters', element: <PricingParametersPage /> },
  {
    path: '/references/additional-reference',
    element: <Navigate to="/references/pricing-parameters" replace />,
  },
] as const;
