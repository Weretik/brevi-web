import type { FabricNormValues } from './fabric-norm';

export type ProductionOrderStatus = 'New' | 'Closed' | 'Cancelled';
export type ReportPriceTier = 'Retail' | 'Wholesale' | 'Large';
export type ItemApplicationKind = 'Embroidery' | 'Print';

export const productionOrderStatusLabels: Record<ProductionOrderStatus, string> = {
  New: 'Нове',
  Closed: 'Закрите',
  Cancelled: 'Скасоване',
};

export const reportPriceTierLabels: Record<ReportPriceTier, string> = {
  Retail: 'Роздріб',
  Wholesale: 'Опт',
  Large: 'Великий опт',
};

export const itemApplicationKindLabels: Record<ItemApplicationKind, string> = {
  Embroidery: 'Вишивка',
  Print: 'Друк',
};

export const PRODUCTION_ORDER_MAX_ADDITIONAL_COLORS = 2;
export const PRODUCTION_ORDER_MAX_APPLICATIONS = 10;

export interface ItemApplication {
  kind: ItemApplicationKind;
  place: string | null;
  description: string | null;
  color: string | null;
}

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
}

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
  counts: ProductionOrderCounts;
  managers: string[];
}

/** What the signed-in person may do; the server hides prices they may not see. */
export interface ProductionOrderPermissions {
  canEdit: boolean;
  canCopy: boolean;
  canDelete: boolean;
  seesSewingRate: boolean;
  seesReportPrice: boolean;
}

export interface ProductionItem {
  id: number;
  position: number;
  modelCode: string | null;
  modelName: string;
  fabricCode: string | null;
  fabricName: string | null;
  quantity: number;
  dueDate: string;
  mainColor: string;
  additionalColors: string[];
  sizesText: string | null;
  technicalChanges: string | null;
  comment: string | null;
  applications: ItemApplication[];
  plannedFabricMeters: number | null;
  /** null for a manager. */
  sewingRate: number | null;
  /** null for anyone but Admin and Director. */
  reportUnitPrice: number | null;
}

export interface ProductionOrder {
  id: number;
  number: number;
  status: ProductionOrderStatus;
  clientName: string;
  quoteId: number | null;
  quoteNumber: string | null;
  managerName: string;
  orderDate: string;
  comment: string | null;
  priceTier: ReportPriceTier | null;
  isTransferred: boolean;
  copiedFromOrderId: number | null;
  createdAt: string;
  createdByName: string;
  updatedAt: string;
  version: number;
  permissions: ProductionOrderPermissions;
  items: ProductionItem[];
}

/** A line of «Історія змін». */
export interface ProductionOrderChange {
  id: number;
  itemId: number | null;
  itemName: string | null;
  field: string;
  before: string | null;
  after: string | null;
  actorName: string;
  at: string;
}

/** A sent КП that can go to the workshop. */
export interface ProductionQuoteSource {
  id: number;
  number: string;
  clientName: string;
  responsibleName: string;
  lastSentAt: string | null;
  ordersCount: number;
}

export interface ProductionQuoteDraftOption {
  optionId: number;
  title: string;
  fabricCode: string | null;
  fabricName: string | null;
  retail: number | null;
  wholesale: number | null;
  large: number | null;
  /** null for a manager. */
  sewingRate: number | null;
}

export interface ProductionQuoteDraftItem {
  quoteItemId: number;
  name: string;
  modelCode: string | null;
  norm: FabricNormValues | null;
  options: ProductionQuoteDraftOption[];
}

export interface ProductionQuoteDraft {
  quoteId: number;
  number: string;
  clientName: string;
  managerName: string;
  items: ProductionQuoteDraftItem[];
}

export interface ProductionOrderListQuery {
  search: string;
  status: ProductionOrderStatus | null;
  manager: string | null;
  /** yyyy-mm-dd: items due on or before it. */
  dueTo: string | null;
  page: number;
  pageSize: number;
}

export interface ProductionItemDetails {
  quantity: number;
  dueDate: string;
  mainColor: string;
  additionalColors: string[];
  sizesText: string | null;
  technicalChanges: string | null;
  comment: string | null;
  applications: ItemApplication[];
}

export interface CreateProductionOrderBody {
  requestId: string;
  quoteId: number;
  clientName: string;
  orderDate: string;
  comment: string | null;
  priceTier: ReportPriceTier;
  items: { quoteItemId: number; quoteOptionId: number; details: ProductionItemDetails }[];
}

export interface UpdateProductionOrderBody {
  version: number;
  clientName: string;
  orderDate: string;
  comment: string | null;
  items: { id: number; details: ProductionItemDetails; sewingRate: number | null }[];
}

/** An order of the old «Цех» from production-orders.json. */
export interface ProductionOrderImportRow {
  legacyId: string;
  number: number;
  quoteNumber: string | null;
  clientName: string;
  managerEmail: string | null;
  managerName: string;
  status: ProductionOrderStatus;
  orderDate: string;
  comment: string | null;
  items: {
    modelCode: string | null;
    modelName: string;
    fabricCode: string | null;
    fabricName: string | null;
    sewingRate: number | null;
    details: ProductionItemDetails;
  }[];
}

/** What the signed-in person may do on the list: create from a КП (Admin, Manager), import (Admin). */
export interface ProductionOrderActor {
  canCreate: boolean;
  canImport: boolean;
}
