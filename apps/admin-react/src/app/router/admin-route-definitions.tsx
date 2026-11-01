import { clientsRoutes } from '@admin/clients/feature';
import { dashboardRoutes } from '@admin/dashboard/feature';
import { productsRoutes } from '@admin/products/feature';
import { referencesRoutes } from '@admin/references/feature';
import { remindersRoutes } from '@admin/reminders/feature';

export const adminRouteDefinitions = [
  ...dashboardRoutes,
  ...referencesRoutes,
  ...clientsRoutes,
  ...productsRoutes,
  ...remindersRoutes,
];
