import { createClientsRoutes } from '@admin/clients/feature';
import { createContentRoutes } from '@admin/content/feature';
import { createDashboardRoutes } from '@admin/dashboard/feature';
import { createEmbroideryRoutes } from '@admin/embroidery/feature';
import { createLeadsRoutes } from '@admin/leads/feature';
import { mediaRoutes } from '@admin/media/feature';
import {
  createProductionOrderRoutes,
  createProductionReportRoutes,
  createProductionRoutes,
  QuoteProductionOrders,
} from '@admin/production/feature';
import { productsRoutes } from '@admin/products/feature';
import { createQuotesRoutes } from '@admin/quotes/feature';
import { createReferencesRoutes } from '@admin/references/feature';
import { remindersRoutes } from '@admin/reminders/feature';
import { createTasksRoutes } from '@admin/tasks/feature';

import { useCanSeeFinance } from './use-can-see-finance';
import { useCanSeePurchaseInvoices } from './use-can-see-purchase-invoices';
import { useContentProductsViewer } from './use-content-products-viewer';
import { useDashboardViewer } from './use-dashboard-viewer';
import { useEmbroideryViewer } from './use-embroidery-viewer';
import { useLeadStatsViewer, useLeadViewer } from './use-lead-viewer';
import { useProductionOrderActor } from './use-production-order-actor';
import { useQuoteActor } from './use-quote-actor';
import { useQuoteSupplierCard } from './use-quote-supplier-card';
import { useSiteCategoriesViewer } from './use-site-categories-viewer';
import { useTaskViewer } from './use-task-viewer';

export const adminRouteDefinitions = [
  ...createDashboardRoutes({ useViewer: useDashboardViewer }),
  ...createReferencesRoutes({ useCanSeePurchaseInvoices, useCanSeeFinance }),
  ...createClientsRoutes({ useCanSeeFinance }),
  ...createQuotesRoutes({
    useQuoteActor,
    useSupplierCard: useQuoteSupplierCard,
    workshopCard: QuoteProductionOrders,
  }),
  ...createLeadsRoutes({ useLeadViewer, useLeadStatsViewer }),
  ...productsRoutes,
  ...remindersRoutes,
  ...mediaRoutes,
  ...createContentRoutes({ useContentProductsViewer, useSiteCategoriesViewer }),
];

/** Task pages need a role check, so the router wraps them instead of listing them above. */
export const tasksRoutes = createTasksRoutes({ useTaskViewer });

/** «Ціна вишивки» is for Admin and Manager, so the router wraps it too. */
export const embroideryRoutes = createEmbroideryRoutes({ useEmbroideryViewer });

/** «Швейний цех» pages need the WorkshopChief or Admin role, so the router wraps them too. */
export const productionRoutes = createProductionRoutes({ useOrderActor: useProductionOrderActor });

/** «Звіти цеху» are for Admin (the director holds Admin), so the router wraps them too. */
export const productionReportRoutes = createProductionReportRoutes();

/** «Виробничі завдання» need Admin, Manager or WorkshopChief, so the router wraps them too. */
export const productionOrderRoutes = createProductionOrderRoutes({
  useOrderActor: useProductionOrderActor,
});
