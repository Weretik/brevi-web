import { Routes } from '@angular/router';
import { Home } from './pages/home';
import { StorefrontLayout } from '@storefront/layout/storefront-layout/storefront-layout';
import { Catalog } from '@storefront/pages/catalog';
import { Contacts } from '@storefront/pages/contacts';

export const storefrontRoutes: Routes = [
  {
    path: '',
    component: StorefrontLayout,
    children: [
      { path: '', component: Home },
      { path: 'catalog', component: Catalog },
      { path: 'contacts', component: Contacts },
    ],
  },
];
