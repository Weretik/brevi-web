import { toDeskList } from './desk-list';

import type { DashboardMetric } from './dashboard-view';
import type { DeskList, DeskListRow } from './desk-list';
import type { LeadMyDay } from '@admin/leads/model';
import type { ProductionOrderSummary } from '@admin/production/model';
import type { TaskOverview, TaskSummary } from '@admin/tasks/model';

const shortDate = (iso: string) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}`;

const clock = (iso: string) =>
  new Date(iso).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

/** «Черга дзвінків» of «Мій день»: overdue calls are marked, the rest show their time. */
export function callQueue(day: LeadMyDay): DeskList {
  return toDeskList(
    day.queue.map<DeskListRow>((lead) => ({
      key: String(lead.id),
      name: lead.company,
      href: '/crm/leads',
      ...(lead.isOverdue
        ? { mark: { text: 'прострочено', tone: 'error' as const } }
        : lead.nextContactAt
          ? { value: clock(lead.nextContactAt) }
          : {}),
    })),
  );
}

/** «Завдання, що горять»: overdue first, then urgent; calm tasks are left to «Мої завдання». */
export function burningTasks(tasks: readonly TaskSummary[]): DeskList {
  return toDeskList(
    tasks
      .filter((task) => task.isOverdue || task.isUrgent)
      .sort((a, b) => Number(b.isOverdue) - Number(a.isOverdue) || a.dueAt.localeCompare(b.dueAt))
      .map<DeskListRow>((task) => ({
        key: String(task.id),
        name: task.customerName ? `${task.title} · ${task.customerName}` : task.title,
        href: '/crm/tasks',
        mark: task.isOverdue
          ? { text: 'прострочено', tone: 'error' }
          : { text: 'терміново', tone: 'warning' },
      })),
  );
}

const isLate = (order: ProductionOrderSummary, today: string) =>
  order.nearestDueDate !== null && order.nearestDueDate < today;

/** «Мої замовлення в цеху»: the nearest due date first; a late order is marked, the rest show their date. */
export function myOrders(orders: readonly ProductionOrderSummary[], today: string): DeskList {
  return toDeskList(
    orders.map<DeskListRow>((order) => ({
      key: String(order.id),
      name: `№${order.number} ${order.clientName}`,
      href: `/production/orders/${order.id}`,
      ...(isLate(order, today)
        ? { mark: { text: 'запізнюється', tone: 'error' as const } }
        : order.nearestDueDate
          ? { value: `до ${shortDate(order.nearestDueDate)}` }
          : {}),
    })),
  );
}

export interface SalesFigures {
  day: LeadMyDay | null;
  tasks: TaskOverview | null;
  quotes: number | null;
  orders: { total: number; late: number } | null;
}

/** The metric strip of the manager desk; a figure is left out when its section is not open to the person. */
export function salesMetrics({ day, tasks, quotes, orders }: SalesFigures): DashboardMetric[] {
  const metrics: DashboardMetric[] = [];
  if (day) {
    metrics.push({
      label: 'Дзвінки сьогодні',
      value: `${day.callsToday} з ${day.plannedToday}`,
      note: { text: `у черзі ${day.queue.length}` },
    });
  }
  if (tasks) {
    metrics.push({
      label: 'Мої завдання',
      value: String(tasks.open),
      ...(tasks.overdue > 0
        ? { note: { text: `${tasks.overdue} прострочено`, tone: 'error' as const } }
        : {}),
    });
  }
  if (quotes !== null) metrics.push({ label: 'Мої КП', value: String(quotes) });
  if (orders) {
    metrics.push({
      label: 'Замовлення в цеху',
      value: String(orders.total),
      ...(orders.late > 0
        ? { note: { text: `${orders.late} запізнюється`, tone: 'error' as const } }
        : {}),
    });
  }
  return metrics;
}

export const lateCount = (orders: readonly ProductionOrderSummary[], today: string) =>
  orders.filter((order) => isLate(order, today)).length;
