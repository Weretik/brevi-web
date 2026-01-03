import { Routes } from '@angular/router';

export const catalogRoutes: Routes = [
  {
    path: 'catalog',
    loadComponent: () => import('./pages/products-list/products-list').then((p) => p.ProductsList),
  },
  {
    path: 'product-page',
    loadComponent: () => import('./pages/product-page/product-page').then((p) => p.ProductPage),
  },
];
