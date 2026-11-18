import type { ItemApplication } from './production-order-applications';
import type {
  ProductionOrderFile,
  ProductionShipment,
  ProductionStage,
  ProductionTelegram,
} from './production-tracking';

export type ProductionOrderStatus = 'New' | 'Closed' | 'Cancelled';
export type ReportPriceTier = 'Retail' | 'Wholesale' | 'Large';

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

/** What the signed-in person may do; the server hides prices they may not see. */
export interface ProductionOrderPermissions {
  canEdit: boolean;
  canCopy: boolean;
  canDelete: boolean;
  seesSewingRate: boolean;
  seesReportPrice: boolean;
  /** Tick stages and ship: WorkshopChief and Admin on a «Нове» order. */
  canTrack: boolean;
  canClose: boolean;
  canCancel: boolean;
  canReopen: boolean;
  canManageFiles: boolean;
  canSendTelegram: boolean;
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
  /** Ticked stages in order. */
  stages: ProductionStage[];
  /** The furthest ticked stage; it colours the row. */
  currentStage: ProductionStage;
  shippedQuantity: number;
  shipments: ProductionShipment[];
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
  cancelReason: string | null;
  files: ProductionOrderFile[];
  telegram: ProductionTelegram;
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
