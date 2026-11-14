import { useGetLeadMyDayQuery } from '@admin/leads/data-access';
import { useGetProductionOrdersQuery } from '@admin/production/data-access';
import { useListQuotesQuery } from '@admin/quotes/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useGetTaskOverviewQuery, useListTasksQuery } from '@admin/tasks/data-access';

import { burningTasks, lateCount, myOrders, salesMetrics } from '../model/desk-views/sales-view';

import type { DashboardViewer } from '../model/desk-views/dashboard-view';

/**
 * Data of «Робочий стіл менеджера»: «Мій день» of leads, own tasks, КП and orders in the workshop. A block the person
 * has no right to see is not requested.
 */
export function useSalesDesk(viewer: DashboardViewer, today: string) {
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

  const orderItems = orders.data?.items ?? [];
  const errors = [
    day.error && adminApiErrorMessage(day.error, 'Не вдалося завантажити «Мій день».'),
    (taskOverview.error || tasks.error) &&
      adminApiErrorMessage(taskOverview.error ?? tasks.error, 'Не вдалося завантажити завдання.'),
    quotes.error && adminApiErrorMessage(quotes.error, 'Не вдалося завантажити КП.'),
    orders.error && adminApiErrorMessage(orders.error, 'Не вдалося завантажити замовлення в цеху.'),
  ].filter((text): text is string => Boolean(text));

  return {
    sees,
    blocked: !sees.leads && !sees.tasks && !sees.quotes && !sees.orders,
    day: day.data ?? null,
    quotes: quotes.data ?? null,
    burning: tasks.data ? burningTasks(tasks.data.items) : null,
    own: orders.data ? myOrders(orderItems, today) : null,
    metrics: salesMetrics({
      day: day.data ?? null,
      tasks: taskOverview.data ?? null,
      quotes: quotes.data ? quotes.data.total : null,
      orders: orders.data ? { total: orders.data.total, late: lateCount(orderItems, today) } : null,
    }),
    errors,
  };
}
