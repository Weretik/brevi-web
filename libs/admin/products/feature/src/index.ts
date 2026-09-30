import { lazy } from 'react';

export const ProductsPage = lazy(() =>
  import('./pages/products-page').then((module) => ({ default: module.ProductsPage })),
);
export const ProductDetailPage = lazy(() =>
  import('./pages/product-detail-page').then((module) => ({ default: module.ProductDetailPage })),
);
export const ProductCreatePage = lazy(() =>
  import('./pages/product-create-page').then((module) => ({ default: module.ProductCreatePage })),
);
export const ProductEditPage = lazy(() =>
  import('./pages/product-edit-page').then((module) => ({ default: module.ProductEditPage })),
);
export const MediaPage = lazy(() =>
  import('./pages/media-page').then((module) => ({ default: module.MediaPage })),
);
