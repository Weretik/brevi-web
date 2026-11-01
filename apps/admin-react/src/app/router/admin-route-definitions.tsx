import { clientsRoutes } from '@admin/clients/feature';
import { dashboardRoutes } from '@admin/dashboard/feature';
import { productsRoutes } from '@admin/products/feature';
import { referencesRoutes } from '@admin/references/feature';
import { remindersRoutes } from '@admin/reminders/feature';

import { EmailTemplateAccess } from './email-template-access';

export const adminRouteDefinitions = [
  ...dashboardRoutes,
  ...referencesRoutes,
  ...clientsRoutes.map((route) =>
    route.path === '/crm/email-templates'
      ? { ...route, element: <EmailTemplateAccess>{route.element}</EmailTemplateAccess> }
      : route,
  ),
  ...productsRoutes,
  ...remindersRoutes,
];
