import { lazy } from 'react';

import type { LeadStatsViewer, LeadViewer, SiteRequestViewer } from '@admin/leads/model';
import type { RouteObject } from 'react-router-dom';

const LeadsPage = lazy(() => import('./pages/work/leads-page'));
const LeadStatsPage = lazy(() => import('./pages/stats/lead-stats-page'));
const SiteRequestsPage = lazy(() => import('./pages/site-requests/site-requests-page'));

export const leadsPath = '/crm/leads';
export const leadStatsPath = '/admin/leads';
export const siteRequestsPath = '/crm/site-requests';

export interface LeadsRouteOptions {
  /** The signed-in staff member and their rights on «Ліди»; the app reads them from the session. */
  useLeadViewer: () => LeadViewer;
  /** Rights on «Адміністрування › Ліди». */
  useLeadStatsViewer: () => LeadStatsViewer;
  /** Rights on «Заявки з сайту». */
  useSiteRequestViewer: () => SiteRequestViewer;
}

type LeadRoute = RouteObject & { path: string };

/** The pages sit behind «Права доступу»: `leads`, `lead-stats` and `site-requests`. */
export function createLeadsRoutes({
  useLeadViewer,
  useLeadStatsViewer,
  useSiteRequestViewer,
}: LeadsRouteOptions): LeadRoute[] {
  function Work() {
    return <LeadsPage viewer={useLeadViewer()} />;
  }
  function Stats() {
    return <LeadStatsPage viewer={useLeadStatsViewer()} />;
  }
  function SiteRequests() {
    return <SiteRequestsPage viewer={useSiteRequestViewer()} />;
  }
  return [
    { path: leadsPath, element: <Work /> },
    { path: leadStatsPath, element: <Stats /> },
    { path: siteRequestsPath, element: <SiteRequests /> },
  ];
}
