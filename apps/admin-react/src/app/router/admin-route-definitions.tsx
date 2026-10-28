import { clientsRoutes } from '@admin/clients/feature';
import { productsRoutes } from '@admin/products/feature';
import { referencesRoutes } from '@admin/references/feature';

import { StartPage } from '../pages/start-page';

export const adminRouteDefinitions = [
  { path: '/', element: <StartPage /> },
  ...referencesRoutes,
  ...clientsRoutes,
  ...productsRoutes,
];
