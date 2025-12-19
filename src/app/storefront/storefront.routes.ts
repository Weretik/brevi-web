import { Routes } from '@angular/router';
import { Home } from './pages/home';
import { StorefrontLayout } from '@storefront/layout/storefront-layout/storefront-layout';

export const storefrontRoutes: Routes = [
  {
    path: '',
    component: StorefrontLayout,
    children: [{ path: '', component: Home }],
  },
];
