import type { ProductionOrderStatus, ReportPriceTier } from './production-order';
import type {
  ItemApplicationInput,
  ProductionEmbroideryChoice,
} from './production-order-applications';
import type { FabricNormValues } from '../norms/fabric-norm';

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
  /** «Вишивка» rows of the КП whose calculation still exists. */
  embroideries: { quoteItemId: number; calculation: ProductionEmbroideryChoice }[];
}

export interface ProductionItemDetails {
  quantity: number;
  dueDate: string;
  mainColor: string;
  additionalColors: string[];
  sizesText: string | null;
  technicalChanges: string | null;
  comment: string | null;
  applications: ItemApplicationInput[];
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
