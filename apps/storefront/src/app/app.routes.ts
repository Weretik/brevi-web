import { Route } from '@angular/router';
import { aboutUsRoutes } from '@storefront/feature/about-us';
import { catalogRoutes } from '@storefront/feature/catalog';
import { contactsRoutes } from '@storefront/feature/contacts';
import { homeRoutes } from '@storefront/feature/home';
import { orderInBulkRoutes } from '@storefront/feature/order-in-bulk';
import { regionsRoutes } from '@storefront/feature/regions';

export const appRoutes: Route[] = [
  ...homeRoutes,
  ...contactsRoutes,
  ...catalogRoutes,
  ...aboutUsRoutes,
  ...orderInBulkRoutes,
  ...regionsRoutes,
];
