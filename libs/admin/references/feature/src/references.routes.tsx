import { lazy } from 'react';

const AdditionalReferencesPage = lazy(
  () => import('./pages/additional-references/additional-references-page'),
);
const GarmentAccessoriesPage = lazy(
  () => import('./pages/garment-accessories/garment-accessories-page'),
);
const GarmentPartsPage = lazy(() => import('./pages/garment-parts/garment-parts-page'));
const SuppliersPage = lazy(() => import('./pages/suppliers/suppliers-page'));

export const referencesRoutes = [
  { path: '/references/supplier', element: <SuppliersPage /> },
  { path: '/references/garment-accessory', element: <GarmentAccessoriesPage /> },
  { path: '/references/garment-part-operation', element: <GarmentPartsPage /> },
  { path: '/references/additional-reference', element: <AdditionalReferencesPage /> },
] as const;
