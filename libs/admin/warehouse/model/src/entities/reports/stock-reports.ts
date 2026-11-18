import type { FabricLayer } from '../issues/item-fabric';

// «План і факт» (WH-005, TZ §11)

export const planFactResults = ['Economy', 'Overrun', 'OnPlan', 'NoPlan', 'NeedsCheck'] as const;
export type PlanFactResult = (typeof planFactResults)[number];

export const planFactResultLabels: Record<PlanFactResult, string> = {
  Economy: 'Економія',
  Overrun: 'Перевитрата',
  OnPlan: 'За планом',
  NoPlan: 'Без плану',
  NeedsCheck: 'Потрібна перевірка',
};

/** Totals of a model or of the report; per product is weighted by products. */
export interface PlanFactSummary {
  orders: number;
  products: number;
  planPerProduct: number | null;
  factPerProduct: number;
  /** Null when any item cannot be compared. */
  differencePerProduct: number | null;
  difference: number | null;
  result: PlanFactResult;
  uncomparableItems: number;
}

export interface PlanFactMaterial {
  /** Null when an additional fabric has no role. */
  layer: FabricLayer | null;
  planFabricCode: string | null;
  planFabricName: string | null;
  planColor: string | null;
  plan: number | null;
  /** Null for a planned part with nothing issued: «не зафіксовано». */
  fact: number | null;
  difference: number | null;
  used: string[];
}

export interface PlanFactItem {
  orderId: number;
  orderNumber: number;
  clientName: string;
  itemId: number;
  products: number;
  plan: number | null;
  fact: number;
  difference: number | null;
  result: PlanFactResult;
  reason: string | null;
  materials: PlanFactMaterial[];
  /** The day of the last issue; the period goes by it. */
  issuedOn: string | null;
}

export interface PlanFactModel {
  modelName: string;
  modelCode: string | null;
  summary: PlanFactSummary;
  items: PlanFactItem[];
}

export interface PlanFactReport {
  models: PlanFactModel[];
  total: PlanFactSummary;
  /** Items whose issues do not cover all their products yet; left out. */
  inProgressItems: number;
}

/** The period of «План і факт» by the day of the last issue; null leaves that end open. */
export interface PlanFactFilter {
  from: string | null;
  to: string | null;
}

// «Бронь і що замовити» (TZ §12)

export interface BookingItem {
  orderId: number;
  orderNumber: number;
  clientName: string;
  itemId: number;
  modelName: string;
  dueDate: string | null;
  layer: FabricLayer;
  plan: number;
  covered: number;
  remaining: number;
  reserved: number;
  toOrder: number;
}

export interface BookingPair {
  fabricCode: string;
  fabricName: string;
  color: string;
  /** May be negative. */
  stock: number;
  need: number;
  reserved: number;
  free: number;
  toOrder: number;
  /** The negative balance already there, as a positive figure. */
  shortage: number;
  /** The fabric's supplier from the reference; null when unknown. */
  supplier: string | null;
  /** The nearest due date of the items still short, else of those not issued; null when none has one. */
  needBy: string | null;
  items: BookingItem[];
}

export interface BookingUnknown {
  orderId: number;
  orderNumber: number;
  clientName: string;
  itemId: number;
  modelName: string;
  reason: string;
}

export interface BookingReport {
  reserved: number;
  free: number;
  toOrder: number;
  pairs: BookingPair[];
  unknown: BookingUnknown[];
  calculatedAt: string;
  /** The person may record «Прихід» (the stock keepers). */
  canReceive: boolean;
}

// «Вартість складу» (TZ §13)

// «Фурнітура до замовлення» (TZ §14)
