export const PRODUCTION_WORK_MAX_QUANTITY = 100_000;
export const PRODUCTION_WORK_COMMENT_MAX_LENGTH = 1000;
export const PRODUCTION_WORK_REASON_MAX_LENGTH = 500;

export const productionWorkKinds = ['Sewing', 'Cutting'] as const;
export type ProductionWorkKind = (typeof productionWorkKinds)[number];

export const productionWorkKindLabels: Record<ProductionWorkKind, string> = {
  Sewing: 'Пошив',
  Cutting: 'Крій',
};

/** A line of «Журнал робіт»: a worker sewed or cut pieces of an item on a day. */
export interface ProductionWork {
  id: number;
  orderId: number;
  orderNumber: number;
  clientName: string;
  itemId: number;
  modelName: string;
  employeeId: number;
  employeeName: string;
  kind: ProductionWorkKind;
  quantity: number;
  workDate: string;
  /** Beyond the item quantity; does not count toward the plan. */
  overPlan: boolean;
  reason: string | null;
  comment: string | null;
  /** Sewing rate of the item in UAH when the work was recorded. */
  rate: number;
  isVoided: boolean;
  voidedAt: string | null;
  voidedByName: string | null;
  voidReason: string | null;
  createdByName: string;
  createdAt: string;
}

export interface WorkEmployeeChoice {
  id: number;
  fullName: string;
  position: string;
}

/** An item of a «Нове» order that can take work. */
export interface WorkItemChoice {
  orderId: number;
  orderNumber: number;
  clientName: string;
  itemId: number;
  modelName: string;
  quantity: number;
  sewn: number;
  cut: number;
  sewingRate: number | null;
}

export interface WorkChoices {
  employees: WorkEmployeeChoice[];
  items: WorkItemChoice[];
  overPlanReasons: string[];
}

export interface WorkLog {
  month: string;
  rows: ProductionWork[];
  totals: { sewn: number; cut: number; records: number };
}

export interface WorkLogQuery {
  month: string;
  employeeId: number | null;
  orderId: number | null;
}

/** «Робота» of an item in the order card. */
export interface ProductionItemWorkCard {
  orderId: number;
  itemId: number;
  orderNumber: number;
  modelName: string;
  quantity: number;
  sewingRate: number | null;
  sewn: number;
  cut: number;
  rows: ProductionWork[];
  canRecord: boolean;
  /** Why work cannot be recorded here; null when it can, or for people who cannot record anyway. */
  cannotRecord: string | null;
}

export interface CreateProductionWorkBody {
  employeeId: number;
  kind: ProductionWorkKind;
  quantity: number;
  workDate: string;
  overPlan: boolean;
  reason: string | null;
  comment: string | null;
}

export interface ProductionWorkImportFile {
  rows: unknown[];
}
