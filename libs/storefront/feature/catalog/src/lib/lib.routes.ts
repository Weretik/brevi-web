import { Routes } from '@angular/router';

export const catalogRoutes: Routes = [
  {
    path: 'catalog',
    loadComponent: () =>
      import('./page/catalog-list-page/catalog-list-page').then((p) => p.CatalogListPage),
  },
];
