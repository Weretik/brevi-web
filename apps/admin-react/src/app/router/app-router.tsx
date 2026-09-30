import { AdminLayout } from '@admin/core/shell';
import {
  ProductCreatePage,
  ProductDetailPage,
  ProductEditPage,
  ProductsPage,
  MediaPage,
} from '@admin/products/feature';
import {
  AdditionalReferencesPage,
  GarmentAccessoriesPage,
  GarmentPartsPage,
  SuppliersPage,
} from '@admin/references/feature';
import { CircularProgress } from '@mui/material';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { createNavigation } from './navigation-config';
import { NotFoundPage } from '../pages/not-found-page';
import { StartPage } from '../pages/start-page';
import { useAdminColorMode } from '../providers/color-mode-provider';

const availableRoutes = [
  { path: '/', element: <StartPage /> },
  { path: '/references/supplier', element: <SuppliersPage /> },
  { path: '/references/garment-accessory', element: <GarmentAccessoriesPage /> },
  { path: '/references/garment-part-operation', element: <GarmentPartsPage /> },
  { path: '/references/additional-reference', element: <AdditionalReferencesPage /> },
  { path: '/references/products', element: <ProductsPage /> },
  { path: '/references/products/create', element: <ProductCreatePage /> },
  { path: '/references/products/:id', element: <ProductDetailPage /> },
  { path: '/references/products/:id/edit', element: <ProductEditPage /> },
  { path: '/references/media', element: <MediaPage /> },
];
const navigation = createNavigation(new Set(availableRoutes.map((route) => route.path)));

export function AppRouter() {
  const { colorMode, changeColorMode } = useAdminColorMode();

  return (
    <Routes>
      <Route
        element={
          <AdminLayout
            colorMode={colorMode}
            navigation={navigation}
            onColorModeChange={changeColorMode}
          />
        }
      >
        {availableRoutes.map((route) => (
          <Route
            element={
              <Suspense fallback={<CircularProgress aria-label="Завантаження сторінки" />}>
                {route.element}
              </Suspense>
            }
            key={route.path}
            path={route.path}
          />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
