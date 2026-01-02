import { Routes } from '@angular/router';

export const FEATURE_HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./page/home-page').then((p) => p.HomePage),
  },
];
