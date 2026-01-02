import { Routes } from '@angular/router';

export const FEATURE_CONTACTS_ROUTES: Routes = [
  {
    path: 'contacts',
    loadComponent: () => import('./page/contacts-page').then((p) => p.ContactsPage),
  },
];
