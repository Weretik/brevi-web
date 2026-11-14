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
import { createWarehouseRoutes } from '@admin/warehouse/feature';

import { useCanSeeFinance } from '../slots/accounting/use-can-see-finance';
import { useSiteCategoriesViewer } from '../slots/content/site/use-site-categories-viewer';
import { useSiteCompanyViewer } from '../slots/content/site/use-site-company-viewer';
import { useSiteCertificatesViewer, useSiteWorksViewer } from '../slots/content/site/use-site-gallery-viewers';
import { useSitePagesViewer } from '../slots/content/site/use-site-pages-viewer';
import { useArticlesViewer } from '../slots/content/use-articles-viewer';
import { useContentProductsViewer } from '../slots/content/use-content-products-viewer';
import { useRedirectsViewer } from '../slots/content/use-redirects-viewer';
import { useSeoSettingsViewer } from '../slots/content/use-seo-settings-viewer';
import { useDashboardViewer } from '../slots/dashboard/use-dashboard-viewer';
import { useEmbroideryViewer } from '../slots/embroidery/use-embroidery-viewer';
import { useLeadStatsViewer, useLeadViewer, useSiteRequestViewer } from '../slots/leads/use-lead-viewer';
import { useProductionOrderActor } from '../slots/production/use-production-order-actor';
import { useWorkshopPeopleAccess } from '../slots/production/use-workshop-people-access';
import { useCanSeePurchaseInvoices } from '../slots/purchasing/use-can-see-purchase-invoices';
import { useQuoteActor } from '../slots/quotes/use-quote-actor';
import { useQuoteSupplierCard } from '../slots/quotes/use-quote-supplier-card';
import { useTaskViewer } from '../slots/tasks/use-task-viewer';
import { useWarehouseAccess } from '../slots/warehouse/use-warehouse-access';

export const adminRouteDefinitions = [
  ...createDashboardRoutes({ useViewer: useDashboardViewer }),
  ...createReferencesRoutes({ useCanSeePurchaseInvoices, useCanSeeFinance }),
  ...createClientsRoutes({ useCanSeeFinance }),
  ...createQuotesRoutes({
    useQuoteActor,
    useSupplierCard: useQuoteSupplierCard,
    workshopCard: QuoteProductionOrders,
  }),
  ...createLeadsRoutes({ useLeadViewer, useLeadStatsViewer, useSiteRequestViewer }),
  ...productsRoutes,
  ...remindersRoutes,
  ...mediaRoutes,
  ...createContentRoutes({
    useContentProductsViewer,
    useSiteCategoriesViewer,
    useArticlesViewer,
    useRedirectsViewer,
    useSeoSettingsViewer,
    useSitePagesViewer,
    useSiteCompanyViewer,
    useSiteWorksViewer,
    useSiteCertificatesViewer,
  }),
  ...createWarehouseRoutes({ useAccess: useWarehouseAccess }),
];

/** Task pages need a role check, so the router wraps them instead of listing them above. */
export const tasksRoutes = createTasksRoutes({ useTaskViewer });

/** «Ціна вишивки» is for Admin and Manager, so the router wraps it too. */
export const embroideryRoutes = createEmbroideryRoutes({ useEmbroideryViewer });

/** «Швейний цех» pages need the WorkshopChief or Admin role, so the router wraps them too. */
export const productionRoutes = createProductionRoutes({
  useOrderActor: useProductionOrderActor,
  usePeopleAccess: useWorkshopPeopleAccess,
});

/** «Звіти цеху» are for Admin (the director holds Admin), so the router wraps them too. */
export const productionReportRoutes = createProductionReportRoutes();

/** «Виробничі завдання» need Admin, Manager or WorkshopChief, so the router wraps them too. */
export const productionOrderRoutes = createProductionOrderRoutes({
  useOrderActor: useProductionOrderActor,
});
