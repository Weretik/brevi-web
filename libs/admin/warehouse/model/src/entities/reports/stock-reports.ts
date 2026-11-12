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

export interface PlanFactFilter {
  model: string;
  client: string;
  fabric: string;
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

export interface ValuationColor {
  color: string;
  meters: number;
  price: number | null;
  value: number | null;
}

export interface ValuationFabric {
  fabricCode: string;
  fabricName: string;
  price: number | null;
  priceFabricCode: string | null;
  meters: number;
  unpricedMeters: number;
  value: number;
  colors: ValuationColor[];
}

export interface ValuationShortage {
  fabricCode: string;
  fabricName: string;
  color: string;
  meters: number;
  price: number | null;
  value: number | null;
}

export interface ValuationReport {
  value: number;
  positiveMeters: number;
  unpricedPairs: number;
  unpricedMeters: number;
  /** Some positive pairs have no price: the value is of the priced part only. */
  isPartial: boolean;
  shortageMeters: number;
  shortageValue: number;
  fabrics: ValuationFabric[];
  shortages: ValuationShortage[];
  calculatedAt: string;
  priceSource: string;
}

// «Фурнітура до замовлення» (TZ §14)

export const hardwareUnitLabels: Record<string, string> = {
  Metre: 'м',
  Piece: 'шт',
  Service: 'послуга',
  Kilogram: 'кг',
};

/** «шт» for Piece; an unknown unit as it came. */
export const hardwareUnitLabel = (unit: string) => hardwareUnitLabels[unit] ?? unit;

export interface HardwareNeedOrder {
  orderId: number;
  orderNumber: number;
  clientName: string;
  itemId: number;
  modelName: string;
  norm: number;
  products: number;
  quantity: number;
  dueDate: string | null;
}

export interface HardwareNeed {
  code: string;
  /** The code when the reference name is unknown. */
  name: string;
  /** False: «Потрібна перевірка назв». */
  nameChecked: boolean;
  note: string | null;
  unit: string;
  quantity: number;
  orders: HardwareNeedOrder[];
  /** The nearest due date of its orders; null when none has one. */
  dueDate: string | null;
}

export interface HardwareIncomplete {
  orderId: number;
  orderNumber: number;
  clientName: string;
  itemId: number;
  modelName: string;
  code: string | null;
  name: string | null;
  reason: string;
}

export interface HardwareReport {
  orders: number;
  items: number;
  needs: HardwareNeed[];
  incomplete: HardwareIncomplete[];
  calculatedAt: string;
}
