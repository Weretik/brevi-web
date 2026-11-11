import type { WorkshopDashboard } from '@admin/production/model';
import type { QuoteSummary } from '@admin/quotes/model';

/** What the signed-in person may see on «Робочий стіл»; the app answers from «Права доступу». */
export interface DashboardViewer {
  /** View right on a page of «Права доступу», e.g. `desk-workshop` or `fabric-booking`. */
  canSee: (page: string) => boolean;
}

export type StatusTone = 'success' | 'warning' | 'error' | 'info';

export interface DashboardMetric {
  label: string;
  value: string;
  note?: { text: string; tone?: 'success' | 'error' };
}

export interface WorkshopOrder {
  id: number;
  number: string;
  client: string;
  product: string;
  quantity: number;
  progress: number;
  due: string;
  overdue: boolean;
}

export type StageTone = 'neutral' | 'primary' | 'secondary' | 'info' | 'success';

export interface WorkshopStage {
  id: number;
  label: string;
  tone: StageTone;
  orders: readonly WorkshopOrder[];
}

export interface RecentQuote {
  id: number;
  number: string;
  client: string;
  responsible: string;
  items: number;
  status: { label: string; tone: StatusTone };
}

export interface WeekHours {
  name: string;
  hours: string;
  /** Share of a 40-hour week, 0–100. */
  load: number;
}

const piecesText = (value: number) => `виробів ${value.toLocaleString('uk-UA')}`;

/** «У цеху», «Прострочено», «Відвантажити»; a late order is the only red note. */
export function workshopMetrics(dashboard: WorkshopDashboard): DashboardMetric[] {
  return [
    {
      label: 'У цеху',
      value: String(dashboard.openOrders),
      note: { text: piecesText(dashboard.openPieces) },
    },
    {
      label: 'Прострочено',
      value: String(dashboard.lateOrders),
      ...(dashboard.lateOrders > 0 ? { note: { text: 'увага', tone: 'error' as const } } : {}),
    },
    {
      label: 'Відвантажити',
      value: String(dashboard.readyOrders),
      ...(dashboard.readyPieces > 0 ? { note: { text: piecesText(dashboard.readyPieces) } } : {}),
    },
  ];
}

const tones: Record<number, StageTone> = {
  1: 'neutral',
  2: 'neutral',
  3: 'neutral',
  4: 'secondary',
  5: 'info',
  6: 'primary',
  7: 'success',
};

const shortDate = (iso: string) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}`;

/** The board columns from «Нове» to «Готово до відвантаження». */
export function workshopStages(dashboard: WorkshopDashboard): WorkshopStage[] {
  return dashboard.stages.map((stage) => ({
    id: stage.stage,
    label: stage.label,
    tone: tones[stage.stage] ?? 'neutral',
    orders: stage.orders.map((order) => ({
      id: order.id,
      number: `№${order.number}`,
      client: order.clientName,
      product: order.items > 1 ? `${order.product} + ще ${order.items - 1}` : order.product,
      quantity: order.quantity,
      progress: order.progress,
      due: shortDate(order.dueDate),
      overdue: order.isLate,
    })),
  }));
}

export function recentQuotes(quotes: readonly QuoteSummary[]): RecentQuote[] {
  return quotes.map((quote) => ({
    id: quote.id,
    number: quote.number,
    client: quote.companyName ?? quote.internalName,
    responsible: quote.responsible.name,
    items: quote.itemsCount,
    status:
      quote.status === 'Sent'
        ? { label: 'Надіслано', tone: 'success' }
        : { label: 'Чернетка', tone: 'info' },
  }));
}

/** Hours of this week; a full week is 40 hours. */
export function weekHours(hours: WorkshopDashboard['hours']): WeekHours[] {
  return (hours ?? []).map((row) => ({
    name: row.name,
    hours: (row.minutes / 60).toLocaleString('uk-UA', { maximumFractionDigits: 2 }),
    load: Math.min(100, Math.round((row.minutes / (40 * 60)) * 100)),
  }));
}
