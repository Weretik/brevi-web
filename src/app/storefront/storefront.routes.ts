import { Routes } from '@angular/router';
import { Home } from './features/home';
import { StorefrontLayout } from '@storefront/layout/storefront-layout/storefront-layout';

export const STOREFRONT_ROUTES: Routes = [
  {
    path: '',
    component: StorefrontLayout,
    children: [{ path: '', component: Home }],
  },
];
