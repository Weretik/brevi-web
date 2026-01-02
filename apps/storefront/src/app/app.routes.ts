import { Route } from '@angular/router';
import { FEATURE_CATALOG_ROUTES } from '@storefront/feature/catalog';
import { FEATURE_CONTACTS_ROUTES } from '@storefront/feature/contacts';
import { FEATURE_HOME_ROUTES } from '@storefront/feature/home';

export const appRoutes: Route[] = [
  ...FEATURE_HOME_ROUTES,
  ...FEATURE_CONTACTS_ROUTES,
  ...FEATURE_CATALOG_ROUTES,
];
