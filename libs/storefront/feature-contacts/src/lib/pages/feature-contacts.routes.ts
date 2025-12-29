import { Routes } from '@angular/router';

export const FEATURE_CONTACTS_ROUTES: Routes = [
  {
    path: 'contacts',
    loadComponent: () => import('@storefront/feature-contacts').then((p) => p.ContactsPage),
  },
];
