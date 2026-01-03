import { Route } from '@angular/router';
import { aboutUsRoutes } from '@storefront/feature/about-us';
import { catalogRoutes } from '@storefront/feature/catalog';
import { contactsRoutes } from '@storefront/feature/contacts';
import { homeRoutes } from '@storefront/feature/home';

export const appRoutes: Route[] = [
  ...homeRoutes,
  ...contactsRoutes,
  ...catalogRoutes,
  ...aboutUsRoutes,
];
