import { Routes } from '@angular/router';

export const FEATURE_CATALOG_ROUTES: Routes = [
  {
    path: 'catalog',
    loadComponent: () =>
      import('./page/catalog-list-page/catalog-list-page').then((p) => p.CatalogListPage),
  },
];
