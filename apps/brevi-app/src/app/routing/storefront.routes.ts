import { Routes } from '@angular/router';
import { FEATURE_CONTACTS_ROUTES } from '@storefront/feature-contacts';
import { FEATURE_HOME_ROUTES } from '@storefront/feature-home';

import { StorefrontLayout } from '../layouts/storefront-layout/storefront-layout';

export const storefrontRoutes: Routes = [
  {
    path: '',
    component: StorefrontLayout,
    children: [...FEATURE_HOME_ROUTES, ...FEATURE_CONTACTS_ROUTES],
  },
];
