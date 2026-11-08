import { lazy } from 'react';

import type { LeadStatsViewer, LeadViewer } from '@admin/leads/model';
import type { RouteObject } from 'react-router-dom';

const LeadsPage = lazy(() => import('./pages/work/leads-page'));
const LeadStatsPage = lazy(() => import('./pages/stats/lead-stats-page'));

export const leadsPath = '/crm/leads';
export const leadStatsPath = '/admin/leads';

export interface LeadsRouteOptions {
  /** The signed-in staff member and their rights on «Ліди»; the app reads them from the session. */
  useLeadViewer: () => LeadViewer;
  /** Rights on «Адміністрування › Ліди». */
  useLeadStatsViewer: () => LeadStatsViewer;
}

type LeadRoute = RouteObject & { path: string };

/** Both pages sit behind «Права доступу»: `leads` and `lead-stats`. */
export function createLeadsRoutes({
  useLeadViewer,
  useLeadStatsViewer,
}: LeadsRouteOptions): LeadRoute[] {
  function Work() {
    return <LeadsPage viewer={useLeadViewer()} />;
  }
  function Stats() {
    return <LeadStatsPage viewer={useLeadStatsViewer()} />;
  }
  return [
    { path: leadsPath, element: <Work /> },
    { path: leadStatsPath, element: <Stats /> },
  ];
}
