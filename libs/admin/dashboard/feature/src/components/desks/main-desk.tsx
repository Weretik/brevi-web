import { useGetFinanceOverviewQuery } from '@admin/accounting/data-access';
import { useGetSeoOverviewQuery } from '@admin/content/data-access';
import { useGetLeadStatsQuery } from '@admin/leads/data-access';
import { useGetWorkshopDashboardQuery } from '@admin/production/data-access';
import { useGetPurchaseInvoicesQuery } from '@admin/purchasing/data-access';
import { useGetQuotePeriodQuery } from '@admin/quotes/data-access';
import { useGetFabricBookingQuery, useGetHardwareOrderQuery } from '@admin/warehouse/data-access';
import { Stack } from '@mui/material';

import { mainCurrency, monthSoFar } from '../../model/desk-views/accounting-view';
import { attentionList, mainMetrics, managerLines } from '../../model/desk-views/main-view';
import { fabricShortages, hardwareToOrder } from '../../model/stock-shortages';
import { DeskGrid } from '../desk-grid/desk-grid';
import { DeskListCard } from '../desk-list/desk-list-card';
import { MetricStrip } from '../metrics/metric-strip';

import type { DeskList } from '../../model/desk-list';
import type { DashboardViewer } from '../../model/desk-views/dashboard-view';

interface MainDeskProps {
  viewer: DashboardViewer;
  /** yyyy-mm-dd of today. */
  today: string;
}

const lineCount = (list: DeskList) => list.rows.length + list.more;

/**
 * «Головний стіл» of the director and administrators (DESK-001 stage 5): the key figures of the business and
 * «Потребує уваги», the problems of every desk in one list. Each source needs its own page of «Права доступу»; money
 * needs «Бухгалтерія».
 */
export function MainDesk({ viewer, today }: MainDeskProps) {
  const sees = {
    money: viewer.canSee('accounting'),
    invoices: viewer.canSee('purchase-invoices'),
    quotes: viewer.canSee('quotes'),
    leads: viewer.canSee('lead-stats'),
    workshop: viewer.canSee('production-orders'),
    fabric: viewer.canSee('fabric-booking'),
    hardware: viewer.canSee('hardware-order'),
    seo: viewer.canSee('content-seo-overview'),
  };
  const month = monthSoFar(today);
  const finance = useGetFinanceOverviewQuery(
    { from: month.from, to: month.to, scope: 'Current' },
    { skip: !sees.money },
  );
  const invoices = useGetPurchaseInvoicesQuery(
    { page: 1, pageSize: 25, search: '', filter: 'NeedsReview' },
    { skip: !sees.invoices },
  );
  const quotes = useGetQuotePeriodQuery({ from: month.from, to: month.to }, { skip: !sees.quotes });
  const leads = useGetLeadStatsQuery({ from: today, to: today }, { skip: !sees.leads });
  const workshop = useGetWorkshopDashboardQuery(undefined, { skip: !sees.workshop });
  const booking = useGetFabricBookingQuery(undefined, { skip: !sees.fabric });
  const hardware = useGetHardwareOrderQuery(undefined, { skip: !sees.hardware });
  const seo = useGetSeoOverviewQuery(undefined, { skip: !sees.seo });

  const data = {
    money: finance.data ? mainCurrency(finance.data) : null,
    finance: finance.data ?? null,
    quotes: quotes.data ?? null,
    leads: leads.data ?? null,
    workshop: workshop.data ?? null,
    fabricShort: booking.data ? lineCount(fabricShortages(booking.data)) : null,
    hardwareShort: hardware.data ? lineCount(hardwareToOrder(hardware.data)) : null,
    seo: seo.data ?? null,
    invoiceProblems: invoices.data ? invoices.data.total : null,
  };
  const metrics = mainMetrics(data, month.name);
  const attention = attentionList(data);
  const managers = managerLines(data.leads, data.quotes);

  return (
    <Stack spacing={2}>
      {metrics.length > 0 && <MetricStrip metrics={metrics} />}
      <DeskGrid columns={2}>
        {attention.rows.length > 0 && (
          <DeskListCard id="attention" list={attention} title="Потребує уваги" />
        )}
        {managers.rows.length > 0 && (
          <DeskListCard
            id="managers"
            link={{ label: 'Статистика лідів', to: '/admin/leads' }}
            list={managers}
            moreText={(more) => `І ще ${more} — у «Статистика лідів».`}
            title="Менеджери сьогодні"
          />
        )}
      </DeskGrid>
    </Stack>
  );
}
