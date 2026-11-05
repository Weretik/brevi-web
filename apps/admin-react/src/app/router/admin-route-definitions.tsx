import { clientsRoutes } from '@admin/clients/feature';
import { contentRoutes } from '@admin/content/feature';
import { dashboardRoutes } from '@admin/dashboard/feature';
import { createEmbroideryRoutes } from '@admin/embroidery/feature';
import { mediaRoutes } from '@admin/media/feature';
import { createProductionOrderRoutes, createProductionRoutes } from '@admin/production/feature';
import { productsRoutes } from '@admin/products/feature';
import { createQuotesRoutes } from '@admin/quotes/feature';
import { createReferencesRoutes } from '@admin/references/feature';
import { remindersRoutes } from '@admin/reminders/feature';
import { createTasksRoutes } from '@admin/tasks/feature';

import { useCanSeePurchaseInvoices } from './use-can-see-purchase-invoices';
import { useEmbroideryViewer } from './use-embroidery-viewer';
import { useProductionOrderActor } from './use-production-order-actor';
import { useQuoteActor } from './use-quote-actor';
import { useTaskViewer } from './use-task-viewer';

export const adminRouteDefinitions = [
  ...dashboardRoutes,
  ...createReferencesRoutes({ useCanSeePurchaseInvoices }),
  ...clientsRoutes,
  ...createQuotesRoutes({ useQuoteActor }),
  ...productsRoutes,
  ...remindersRoutes,
  ...mediaRoutes,
  ...contentRoutes,
];

/** Task pages need a role check, so the router wraps them instead of listing them above. */
export const tasksRoutes = createTasksRoutes({ useTaskViewer });

/** «Ціна вишивки» is for Admin and Manager, so the router wraps it too. */
export const embroideryRoutes = createEmbroideryRoutes({ useEmbroideryViewer });

/** «Швейний цех» pages need the WorkshopChief or Admin role, so the router wraps them too. */
export const productionRoutes = createProductionRoutes({ useOrderActor: useProductionOrderActor });

/** «Виробничі завдання» need Admin, Manager or WorkshopChief, so the router wraps them too. */
export const productionOrderRoutes = createProductionOrderRoutes({
  useOrderActor: useProductionOrderActor,
});
