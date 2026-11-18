import { AccountingDesk } from './accounting-desk';
import { MainDesk } from './main-desk';
import { SalesDesk } from './sales-desk';
import { SeoDesk } from './seo-desk';
import { WorkshopDesk } from './workshop-desk';

import type { DashboardViewer } from '../../model/desk-views/dashboard-view';
import type { DeskKey } from '../../model/desks/desks';

/** yyyy-mm-dd of the person's own day. */
const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

/** One desk by its key. */
export function Desk({ deskKey, viewer }: { deskKey: DeskKey; viewer: DashboardViewer }) {
  switch (deskKey) {
    case 'main':
      return <MainDesk today={today()} viewer={viewer} />;
    case 'workshop':
      return <WorkshopDesk viewer={viewer} />;
    case 'sales':
      return <SalesDesk today={today()} viewer={viewer} />;
    case 'seo':
      return <SeoDesk viewer={viewer} />;
    case 'accounting':
      return <AccountingDesk today={today()} viewer={viewer} />;
  }
}
