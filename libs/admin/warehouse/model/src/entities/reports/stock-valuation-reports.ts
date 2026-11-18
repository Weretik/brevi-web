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
