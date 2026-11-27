import { productionStageLabels, productionStages } from '../../entities/orders/production-tracking';

import type {
  ProductionOrderSummary,
  ProductionOrderSummaryItem,
} from '../../entities/orders/production-order-list';
import type { ProductionStage } from '../../entities/orders/production-tracking';

/** Days after today that still count as «скоро термін», as on the server. */
export const PRODUCTION_DUE_SOON_DAYS = 3;

/** Only a problem gets a mark: an overdue «Нове» order, or one due within three days. */
export type DueState = { kind: 'overdue'; days: number } | { kind: 'soon'; days: number } | null;

const dayNumber = (iso: string) => Math.round(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);

export function dueState(
  row: Pick<ProductionOrderSummary, 'status' | 'nearestDueDate'>,
  today: string,
): DueState {
  if (row.status !== 'New' || !row.nearestDueDate) return null;
  const days = dayNumber(row.nearestDueDate) - dayNumber(today);
  if (days < 0) return { kind: 'overdue', days: -days };
  if (days <= PRODUCTION_DUE_SOON_DAYS) return { kind: 'soon', days };
  return null;
}

/**
 * «Куртка утеплена ×15 · Штани ×10»: the same model in several items is summed. The model of the chosen filter
 * (by its code) stands first, so it is not lost among the others.
 */
export function orderModelsText(
  items: readonly ProductionOrderSummaryItem[],
  firstModelCode: string | null = null,
): string {
  const pieces = new Map<string, { quantity: number; chosen: boolean }>();
  for (const item of items) {
    const entry = pieces.get(item.modelName) ?? { quantity: 0, chosen: false };
    entry.quantity += item.quantity;
    entry.chosen ||= firstModelCode !== null && item.modelCode === firstModelCode;
    pieces.set(item.modelName, entry);
  }
  return [...pieces]
    .sort(([, a], [, b]) => Number(b.chosen) - Number(a.chosen))
    .map(([name, { quantity }]) => `${name} ×${quantity}`)
    .join(' · ');
}

/** Every value once, in the order of the items: the fabrics or the application kinds of an order. */
export function uniqueValues(values: readonly (string | null)[]): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

/** «Синій + Білий»: the main colour of an item and its additional ones. */
export function itemColorsText(
  item: Pick<ProductionOrderSummaryItem, 'mainColor' | 'additionalColors'>,
): string {
  return [item.mainColor, ...item.additionalColors].filter(Boolean).join(' + ');
}

/**
 * How far the items of an order went: the stage index of the order (its slowest item) and, when the items are
 * at different stages, how many of them are further.
 */
export function orderStageSpread(
  stage: ProductionStage,
  items: readonly ProductionOrderSummaryItem[],
) {
  const index = productionStages.indexOf(stage);
  const ahead = items.filter((item) => productionStages.indexOf(item.stage) > index).length;
  return {
    index,
    total: productionStages.length,
    label: productionStageLabels[stage],
    ahead,
    itemsCount: items.length,
  };
}

/** «1 завдання», «3 завдання», «5 завдань». */
export function ordersWord(count: number): string {
  const tens = count % 100;
  const ones = count % 10;
  if (tens >= 11 && tens <= 14) return 'завдань';
  if (ones === 1 || (ones >= 2 && ones <= 4)) return 'завдання';
  return 'завдань';
}
