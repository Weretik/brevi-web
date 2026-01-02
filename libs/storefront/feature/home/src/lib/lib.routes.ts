import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page/home-page').then((p) => p.HomePage),
  },
];
