import { formatMinor } from '@admin/accounting/model';

import { toDeskList } from '../desk-list';

import type { DashboardMetric } from './dashboard-view';
import type { DeskList, DeskListRow } from '../desk-list';
import type { FinanceOverview, FinanceOverviewCurrency } from '@admin/accounting/model';
import type { SeoOverview } from '@admin/content/model';
import type { LeadStats } from '@admin/leads/model';
import type { WorkshopDashboard } from '@admin/production/model';
import type { QuotePeriod } from '@admin/quotes/model';

/** What the main desk got; a source the person may not see, or not loaded yet, is null. */
export interface MainDeskData {
  money: FinanceOverviewCurrency | null;
  finance: FinanceOverview | null;
  quotes: QuotePeriod | null;
  leads: LeadStats | null;
  workshop: WorkshopDashboard | null;
  /** Lines of «Не вистачає тканини» and «Фурнітура до замовлення». */
  fabricShort: number | null;
  hardwareShort: number | null;
  seo: SeoOverview | null;
  /** «Рахунки на закупку», that need a look. */
  invoiceProblems: number | null;
}

/** «Головне»: one figure per part of the business; a figure is marked only for a problem. */
export function mainMetrics(data: MainDeskData, month: string): DashboardMetric[] {
  const metrics: DashboardMetric[] = [];
  if (data.money) {
    const money = data.money;
    metrics.push({
      label: 'Гроші',
      value: formatMinor(money.balanceMinor, money.currency),
      note: {
        text: `${money.differenceMinor < 0 ? '' : '+'}${formatMinor(money.differenceMinor, money.currency)} за ${month}`,
        ...(money.differenceMinor < 0 ? { tone: 'error' as const } : {}),
      },
    });
  }
  if (data.quotes)
    metrics.push({
      label: 'КП за місяць',
      value: String(data.quotes.created),
      note: { text: `надіслано ${data.quotes.sent}` },
    });
  if (data.leads) {
    const managers = data.leads.managers.filter((x) => x.calls > 0).length;
    metrics.push({
      label: 'Дзвінки сьогодні',
      value: String(data.leads.callsInPeriod),
      note: { text: `менеджерів ${managers}` },
    });
  }
  if (data.workshop)
    metrics.push({
      label: 'Цех',
      value: String(data.workshop.openOrders),
      ...(data.workshop.lateOrders > 0
        ? { note: { text: `${data.workshop.lateOrders} прострочено`, tone: 'error' as const } }
        : {}),
    });
  return metrics;
}

/** «Потребує уваги»: the problems of every desk in one list, each with where it is fixed. */
export function attentionList(data: MainDeskData): DeskList {
  const rows: DeskListRow[] = [];
  const add = (key: string, name: string, href: string, text: string, tone: 'error' | 'warning') =>
    rows.push({ key, name, href, mark: { text, tone } });

  if (data.workshop && data.workshop.lateOrders > 0)
    add(
      'late-orders',
      'Цех: замовлення прострочено',
      '/production/orders',
      String(data.workshop.lateOrders),
      'error',
    );
  if (data.fabricShort)
    add(
      'fabric',
      'Склад: не вистачає тканин для замовлень',
      '/warehouse/booking',
      String(data.fabricShort),
      'warning',
    );
  if (data.hardwareShort)
    add(
      'hardware',
      'Склад: фурнітура до замовлення',
      '/warehouse/hardware',
      String(data.hardwareShort),
      'warning',
    );
  for (const manager of data.leads?.managers ?? [])
    if (manager.overdue > 0)
      add(
        `leads-${manager.manager.userId}`,
        `Продажі: ${manager.manager.name}, прострочені дзвінки`,
        '/admin/leads',
        String(manager.overdue),
        'warning',
      );
  if (data.finance && data.finance.needsReviewCount > 0)
    add(
      'finance',
      'Бухгалтерія: операції на перевірку',
      '/accounting/review',
      String(data.finance.needsReviewCount),
      'warning',
    );
  if (data.invoiceProblems)
    add(
      'invoices',
      'Рахунки на закупку з проблемами',
      '/accounting/purchase-invoices',
      String(data.invoiceProblems),
      'warning',
    );
  const seoPages = data.seo?.areas.reduce((sum, x) => sum + x.withProblems, 0) ?? 0;
  if (seoPages > 0)
    add(
      'seo',
      'Сайт: сторінки з проблемами для пошуку',
      '/content/seo-overview',
      String(seoPages),
      'warning',
    );
  if ((data.seo?.siteProblems.length ?? 0) > 0)
    add(
      'seo-settings',
      'Сайт: не заповнені налаштування SEO',
      '/content/seo-settings',
      String(data.seo?.siteProblems.length),
      'warning',
    );
  return { rows, more: 0 };
}

/** «Менеджери»: calls today and open leads from the lead statistics, КП of the month from the quotes. */
export function managerLines(leads: LeadStats | null, quotes: QuotePeriod | null): DeskList {
  const people = new Map<number, { name: string; calls: number; inWork: number; quotes: number }>();
  for (const x of leads?.managers ?? [])
    people.set(x.manager.userId, {
      name: x.manager.name,
      calls: x.calls,
      inWork: x.inWork,
      quotes: 0,
    });
  for (const x of quotes?.managers ?? []) {
    const person = people.get(x.manager.userId) ?? {
      name: x.manager.name,
      calls: 0,
      inWork: 0,
      quotes: 0,
    };
    people.set(x.manager.userId, { ...person, quotes: x.created });
  }
  return toDeskList(
    [...people.entries()]
      .sort(([, a], [, b]) => b.calls - a.calls || b.quotes - a.quotes)
      .map<DeskListRow>(([id, x]) => ({
        key: String(id),
        name: x.name,
        value: [
          leads ? `дзвінків ${x.calls}` : null,
          quotes ? `КП ${x.quotes}` : null,
          leads ? `у роботі ${x.inWork}` : null,
        ]
          .filter(Boolean)
          .join(' · '),
      })),
  );
}
