import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ProductsPage = lazy(() => import('./pages/product-list/products-page'));
const ProductDetailPage = lazy(() => import('./pages/product-detail/product-detail-page'));
const PpeCreatePage = lazy(() => import('./pages/ppe-create/ppe-create-page'));
const SewingCreatePage = lazy(() => import('./pages/product-create/sewing-create-page'));
const ProductEditPage = lazy(() => import('./pages/product-editor/product-edit-page'));
const MediaPage = lazy(() => import('./pages/media-library/media-page'));

export const productsRoutes = [
  { path: '/references/products', element: <ProductsPage /> },
  { path: '/references/products/create', element: <Navigate to="/references/products" replace /> },
  { path: '/references/products/new/ppe', element: <PpeCreatePage /> },
  { path: '/references/products/new/sewing', element: <SewingCreatePage /> },
  { path: '/references/products/:id', element: <ProductDetailPage /> },
  { path: '/references/products/:id/edit', element: <ProductEditPage /> },
  { path: '/references/media', element: <MediaPage /> },
] as const;
