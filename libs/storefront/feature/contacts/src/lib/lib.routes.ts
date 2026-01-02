import { Routes } from '@angular/router';

export const contactsRoutes: Routes = [
  {
    path: 'contacts',
    loadComponent: () => import('./page/contacts-page').then((p) => p.ContactsPage),
  },
];
