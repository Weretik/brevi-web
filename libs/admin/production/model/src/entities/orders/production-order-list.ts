import type { ProductionOrderStatus } from './production-order';
import type { ItemApplicationKind } from './production-order-applications';
import type { ProductionStage } from './production-tracking';

export interface ProductionOrderSummary {
  id: number;
  number: number;
  status: ProductionOrderStatus;
  clientName: string;
  quoteId: number | null;
  quoteNumber: string | null;
  managerName: string;
  orderDate: string;
  itemsCount: number;
  totalQuantity: number;
  nearestDueDate: string | null;
  /** Moved from the old «Цех». */
  isTransferred: boolean;
  updatedAt: string;
  /** The least advanced item: the order is only as far as its slowest item. */
  stage: ProductionStage;
  /** Pieces shipped over every item. */
  shippedQuantity: number;
  /** Items in the order of the card: what the workshop sews and how far each item is. */
  items: ProductionOrderSummaryItem[];
}

export interface ProductionOrderSummaryItem {
  /** Null for a «Виріб з нуля» of the КП. */
  modelCode: string | null;
  modelName: string;
  quantity: number;
  stage: ProductionStage;
  fabricName: string | null;
  mainColor: string;
  additionalColors: string[];
  /** Kinds of the item's «нанесення», each once. */
  applications: ItemApplicationKind[];
}

/** A stage of the «конвеєр»: «Нове» orders whose slowest item is at it, and how many of them are overdue. */
export interface ProductionStageCount {
  stage: ProductionStage;
  count: number;
  overdue: number;
}

/** «Нове» orders due before today, and due today or in the next three days. */
export interface ProductionOrderAttention {
  overdue: number;
  dueSoon: number;
}

/** Server sort of the list; a leading «-» is from the largest. */
export type ProductionOrderSort = 'number' | '-number' | 'due' | '-due' | 'created' | '-created';

export interface ProductionOrderCounts {
  all: number;
  new: number;
  closed: number;
  cancelled: number;
}

export interface ProductionOrderPage {
  items: ProductionOrderSummary[];
  page: number;
  pageSize: number;
  total: number;
  /** Pieces of every order found, over all pages. */
  totalQuantity: number;
  counts: ProductionOrderCounts;
  managers: string[];
  /** Every stage in workshop order over «Нове» orders; ignores the status and stage filters. */
  stages: ProductionStageCount[];
  attention: ProductionOrderAttention;
}

export interface ProductionOrderListQuery {
  search: string;
  status: ProductionOrderStatus | null;
  manager: string | null;
  /** yyyy-mm-dd: items due on or before it. */
  dueTo: string | null;
  stage: ProductionStage | null;
  page: number;
  pageSize: number;
  /** Newest number first when not set. */
  sort?: ProductionOrderSort;
  /** The client card tab «Завдання в цех»: only orders made from this client's КП. */
  customerPublicId?: string;
  /** The КП editor: only orders made from this КП. */
  quoteId?: number;
  /** «Фільтри» of «Виробничі завдання». */
  filters?: ProductionOrderFilterValues;
  /** «Робочий стіл менеджера»: only the orders of this manager (the КП responsible). */
  managerUserId?: number;
}

/** «Фільтри»: null = any. Dates are yyyy-mm-dd; model and fabric are codes. */
export interface ProductionOrderFilterValues {
  client: string | null;
  from: string | null;
  to: string | null;
  model: string | null;
  fabric: string | null;
  color: string | null;
  season: string | null;
}

export type ProductionOrderFilterField = keyof ProductionOrderFilterValues;

export const emptyProductionOrderFilters: ProductionOrderFilterValues = {
  client: null,
  from: null,
  to: null,
  model: null,
  fabric: null,
  color: null,
  season: null,
};

export interface ProductionFilterOption {
  code: string;
  name: string;
}

/** What «Фільтри» offer: values used by orders that are not deleted. */
export interface ProductionOrderFilterOptions {
  clients: string[];
  models: ProductionFilterOption[];
  fabrics: ProductionFilterOption[];
  colors: string[];
  seasons: string[];
}

/** A row of «Зведення за моделями»: ordered pieces of a model in every filtered order. */
export interface ProductionModelSummaryRow {
  modelCode: string | null;
  modelName: string;
  season: string | null;
  category: string;
  quantity: number;
  ordersCount: number;
}

export interface ProductionModelSummary {
  rows: ProductionModelSummaryRow[];
  totalQuantity: number;
}
