export const forecastStatuses = ['Estimated', 'Complete', 'Unknown'] as const;
export type ForecastStatus = (typeof forecastStatuses)[number];

export const forecastReasons = ['MissingRate', 'UnknownPredecessor', 'BeyondHorizon'] as const;
export type ForecastReason = (typeof forecastReasons)[number];

/** Why an order has no date: shown as the problem of its row. */
export const forecastReasonLabels: Record<ForecastReason, string> = {
  MissingRate: 'Немає розцінки пошиття в позиції',
  UnknownPredecessor: 'Невідомо: вище в черзі є завдання без розцінки',
  BeyondHorizon: 'Більше 10 років роботи',
};

export interface ForecastRow {
  orderId: number;
  orderNumber: number;
  clientName: string;
  managerName: string;
  /** Pieces left to sew. */
  remaining: number;
  /** Sewing minutes left; null for people who do not see the rate. */
  minutes: number | null;
  /** Approximate end of sewing, not a delivery date. */
  finishOn: string | null;
  status: ForecastStatus;
  reason: ForecastReason | null;
  /** The earliest «Готово до» of the items. */
  dueDate: string;
  isLate: boolean;
}

export interface ForecastSettings {
  seamstressCount: number;
  shiftMinutes: number;
  /** Admin only. */
  minuteCost: number | null;
}

export interface SewingForecast {
  startDate: string;
  settings: ForecastSettings | null;
  /** Why no date is counted at all. */
  problem: string | null;
  rows: ForecastRow[];
  canReorder: boolean;
  version: number;
}
