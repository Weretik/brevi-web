import { Route } from '@angular/router';
import { catalogRoutes } from '@storefront/feature/catalog';
import { contactsRoutes } from '@storefront/feature/contacts';
import { homeRoutes } from '@storefront/feature/home';

export const appRoutes: Route[] = [...homeRoutes, ...contactsRoutes, ...catalogRoutes];
