import { PRODUCTION_DUE_SOON_DAYS } from './production-order-row';

import type { ProductionItem, ProductionOrder } from '../entities/production-order';

/** An item that still has a due date to keep: not all shipped and not at «Фактично відвантажено» or «Завершено». */
const isOpenItem = (item: ProductionItem) =>
  item.shippedQuantity < item.quantity &&
  item.currentStage !== 'Shipped' &&
  item.currentStage !== 'Complete';

const dayNumber = (iso: string) => Math.round(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);

export interface ProductionDueItem {
  item: ProductionItem;
  /** Days late (overdue) or days left (soon). */
  days: number;
}

/** What the header of an order card shows at a glance. */
export interface ProductionOrderOverview {
  itemsCount: number;
  quantity: number;
  shipped: number;
  /** Earliest and latest «Готово до» of the items. */
  dueFrom: string | null;
  dueTo: string | null;
  /** Only on a «Нове» order: open items past their date, and those due within three days. */
  overdue: ProductionDueItem[];
  soon: ProductionDueItem[];
}

export function productionOrderOverview(
  order: Pick<ProductionOrder, 'status' | 'items'>,
  today: string,
): ProductionOrderOverview {
  const dates = order.items.map((item) => item.dueDate).sort();
  const overdue: ProductionDueItem[] = [];
  const soon: ProductionDueItem[] = [];
  if (order.status === 'New')
    for (const item of order.items.filter(isOpenItem)) {
      const days = dayNumber(item.dueDate) - dayNumber(today);
      if (days < 0) overdue.push({ item, days: -days });
      else if (days <= PRODUCTION_DUE_SOON_DAYS) soon.push({ item, days });
    }
  return {
    itemsCount: order.items.length,
    quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
    shipped: order.items.reduce((sum, item) => sum + item.shippedQuantity, 0),
    dueFrom: dates[0] ?? null,
    dueTo: dates[dates.length - 1] ?? null,
    overdue,
    soon,
  };
}

/** «1 позиція», «3 позиції», «5 позицій». */
export function itemsWord(count: number): string {
  const tens = count % 100;
  const ones = count % 10;
  if (tens >= 11 && tens <= 14) return 'позицій';
  if (ones === 1) return 'позиція';
  if (ones >= 2 && ones <= 4) return 'позиції';
  return 'позицій';
}
