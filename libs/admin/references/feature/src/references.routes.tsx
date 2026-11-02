import { lazy } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

const AdditionalReferencesPage = lazy(
  () => import('./pages/additional-references/additional-references-page'),
);
const MaterialsPage = lazy(() => import('./pages/materials/materials-page'));
const GarmentPartsPage = lazy(() => import('./pages/garment-parts/garment-parts-page'));
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
  { path: '/references/garment-part-operation', element: <GarmentPartsPage /> },
  { path: '/references/additional-reference', element: <AdditionalReferencesPage /> },
] as const;
