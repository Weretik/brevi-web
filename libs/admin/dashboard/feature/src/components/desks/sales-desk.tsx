import { useGetLeadMyDayQuery } from '@admin/leads/data-access';
import { useGetProductionOrdersQuery } from '@admin/production/data-access';
import { useListQuotesQuery } from '@admin/quotes/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useGetTaskOverviewQuery, useListTasksQuery } from '@admin/tasks/data-access';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { recentQuotes } from '../../model/desk-views/dashboard-view';
import { burningTasks, callQueue, lateCount, myOrders, salesMetrics } from '../../model/desk-views/sales-view';
import { DeskGrid } from '../desk-grid/desk-grid';
import { DeskListCard } from '../desk-list/desk-list-card';
import { MetricStrip } from '../metrics/metric-strip';
import { RecentQuotesCard } from '../quotes/recent-quotes-card';

import type { DashboardViewer } from '../../model/desk-views/dashboard-view';

interface SalesDeskProps {
  viewer: DashboardViewer;
  /** yyyy-mm-dd of today; a later due date is not late. */
  today: string;
}

/**
 * «Робочий стіл менеджера» (DESK-001 stage 2): «Мій день» of leads, the tasks that burn, own КП and own orders in the
 * workshop, with the quick actions. Each block needs its own page of «Права доступу».
 */
export function SalesDesk({ viewer, today }: SalesDeskProps) {
  const me = viewer.userId;
  const sees = {
    leads: viewer.canSee('leads'),
    tasks: viewer.canSee('tasks'),
    quotes: viewer.canSee('quotes'),
    orders: viewer.canSee('production-orders') && me !== null,
    embroidery: viewer.canSee('embroidery'),
    clients: viewer.canSee('counterparties'),
  };
  const day = useGetLeadMyDayQuery(undefined, { skip: !sees.leads });
  const taskOverview = useGetTaskOverviewQuery({ assigneeUserId: me }, { skip: !sees.tasks });
  const tasks = useListTasksQuery(
    { search: '', filter: 'Open', assigneeUserId: me, page: 1, pageSize: 50 },
    { skip: !sees.tasks },
  );
  const quotes = useListQuotesQuery(
    { search: '', responsibleUserId: me, page: 1, pageSize: 6 },
    { skip: !sees.quotes },
  );
  const orders = useGetProductionOrdersQuery(
    {
      search: '',
      status: 'New',
      manager: null,
      dueTo: null,
      stage: null,
      page: 1,
      pageSize: 50,
      sort: 'due',
      managerUserId: me ?? undefined,
    },
    { skip: !sees.orders },
  );

  if (!sees.leads && !sees.tasks && !sees.quotes && !sees.orders) {
    return (
      <Typography color="text.secondary">
        Для цього столу потрібні права на «Ліди», «Мої завдання», КП або «Виробничі завдання».
      </Typography>
    );
  }

  const orderItems = orders.data?.items ?? [];
  const burning = tasks.data ? burningTasks(tasks.data.items) : null;
  const own = orders.data ? myOrders(orderItems, today) : null;
  const metrics = salesMetrics({
    day: day.data ?? null,
    tasks: taskOverview.data ?? null,
    quotes: quotes.data ? quotes.data.total : null,
    orders: orders.data ? { total: orders.data.total, late: lateCount(orderItems, today) } : null,
  });
  const errors = [
    day.error && adminApiErrorMessage(day.error, 'Не вдалося завантажити «Мій день».'),
    (taskOverview.error || tasks.error) &&
      adminApiErrorMessage(taskOverview.error ?? tasks.error, 'Не вдалося завантажити завдання.'),
    quotes.error && adminApiErrorMessage(quotes.error, 'Не вдалося завантажити КП.'),
    orders.error && adminApiErrorMessage(orders.error, 'Не вдалося завантажити замовлення в цеху.'),
  ].filter((text): text is string => Boolean(text));

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.25 }}>
        {sees.clients && (
          <Button
            component={RouterLink}
            to="/references/counterparties?tab=clients"
            variant="outlined"
          >
            Клієнти
          </Button>
        )}
        {sees.embroidery && (
          <Button component={RouterLink} to="/crm/embroidery" variant="outlined">
            Ціна вишивки
          </Button>
        )}
        {sees.quotes && (
          <Button
            component={RouterLink}
            startIcon={<AddIcon />}
            to="/crm/quotes/new"
            variant="contained"
          >
            Новий розрахунок
          </Button>
        )}
      </Stack>
      {errors.map((text) => (
        <Alert key={text} severity="error">
          {text}
        </Alert>
      ))}
      {metrics.length > 0 && <MetricStrip metrics={metrics} />}
      <DeskGrid columns={2}>
        {day.data && (
          <DeskListCard
            empty="На сьогодні дзвінків у черзі немає."
            id="call-queue"
            link={{ label: 'Ліди', to: '/crm/leads' }}
            list={callQueue(day.data)}
            moreText={(more) => `І ще ${more} у черзі.`}
            title="Черга дзвінків"
          />
        )}
        {burning && burning.rows.length > 0 && (
          <DeskListCard
            id="burning-tasks"
            link={{ label: 'Мої завдання', to: '/crm/tasks' }}
            list={burning}
            moreText={(more) => `І ще ${more} — у «Мої завдання».`}
            title="Завдання, що горять"
          />
        )}
        {quotes.data && (
          <RecentQuotesCard quotes={recentQuotes(quotes.data.items)} title="Мої КП" />
        )}
        {own && own.rows.length > 0 && (
          <DeskListCard
            id="my-orders"
            link={{ label: 'Виробничі завдання', to: '/production/orders' }}
            list={own}
            moreText={(more) => `І ще ${more} — у «Виробничі завдання».`}
            title="Мої замовлення в цеху"
          />
        )}
      </DeskGrid>
    </Stack>
  );
}
