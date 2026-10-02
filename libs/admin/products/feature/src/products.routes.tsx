import { lazy } from 'react';

const ProductsPage = lazy(() => import('./pages/product-list/products-page'));
const ProductDetailPage = lazy(() => import('./pages/product-detail/product-detail-page'));
const ProductCreatePage = lazy(() => import('./pages/product-editor/product-create-page'));
const ProductEditPage = lazy(() => import('./pages/product-editor/product-edit-page'));
const MediaPage = lazy(() => import('./pages/media-library/media-page'));

export const productsRoutes = [
  { path: '/references/products', element: <ProductsPage /> },
  { path: '/references/products/create', element: <ProductCreatePage /> },
  { path: '/references/products/:id', element: <ProductDetailPage /> },
  { path: '/references/products/:id/edit', element: <ProductEditPage /> },
  { path: '/references/media', element: <MediaPage /> },
] as const;
