import { lazy } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

const AdditionalReferencesPage = lazy(
  () => import('./pages/additional-references/additional-references-page'),
);
const FabricsPage = lazy(() => import('./pages/fabrics/fabrics-page'));
const GarmentAccessoriesPage = lazy(
  () => import('./pages/garment-accessories/garment-accessories-page'),
);
const GarmentPartsPage = lazy(() => import('./pages/garment-parts/garment-parts-page'));
const SuppliersPage = lazy(() => import('./pages/suppliers/suppliers-page'));

/** The old combined page opened fabrics with `?tab=fabrics`; fabrics now have their own page. */
function GarmentAccessoriesRoute() {
  const [searchParams] = useSearchParams();
  return searchParams.get('tab') === 'fabrics' ? (
    <Navigate to="/references/fabric" replace />
  ) : (
    <GarmentAccessoriesPage />
  );
}

export const referencesRoutes = [
  { path: '/references/supplier', element: <SuppliersPage /> },
  { path: '/references/fabric', element: <FabricsPage /> },
  { path: '/references/garment-accessory', element: <GarmentAccessoriesRoute /> },
  { path: '/references/garment-part-operation', element: <GarmentPartsPage /> },
  { path: '/references/additional-reference', element: <AdditionalReferencesPage /> },
] as const;
