import { clientsRoutes } from '@admin/clients/feature';
import { contentRoutes } from '@admin/content/feature';
import { dashboardRoutes } from '@admin/dashboard/feature';
import { mediaRoutes } from '@admin/media/feature';
import { productsRoutes } from '@admin/products/feature';
import { createQuotesRoutes } from '@admin/quotes/feature';
import { referencesRoutes } from '@admin/references/feature';
import { remindersRoutes } from '@admin/reminders/feature';
import { createTasksRoutes } from '@admin/tasks/feature';

import { useQuoteActor } from './use-quote-actor';
import { useTaskViewer } from './use-task-viewer';

export const adminRouteDefinitions = [
  ...dashboardRoutes,
  ...referencesRoutes,
  ...clientsRoutes,
  ...createQuotesRoutes({ useQuoteActor }),
  ...productsRoutes,
  ...remindersRoutes,
  ...mediaRoutes,
  ...contentRoutes,
];

/** Task pages need a role check, so the router wraps them instead of listing them above. */
export const tasksRoutes = createTasksRoutes({ useTaskViewer });
