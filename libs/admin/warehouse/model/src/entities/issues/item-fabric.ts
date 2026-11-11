export const FABRIC_ISSUE_MAX_LINES = 20;
export const FABRIC_ISSUE_LINE_NOTE_MAX_LENGTH = 500;
export const FABRIC_ISSUE_ITEM_SEARCH_MAX_LENGTH = 100;

export const fabricIssuePurposes = ['Planned', 'Replacement', 'Additional'] as const;
export type FabricIssuePurpose = (typeof fabricIssuePurposes)[number];

export const fabricIssuePurposeLabels: Record<FabricIssuePurpose, string> = {
  Planned: 'Планова',
  Replacement: 'Заміна',
  Additional: 'Додаткова',
};

/** Layers of a product: the norms give only «Верх»; an additional line may name its role. */
export const fabricLayers = ['Upper', 'Lining', 'Insulation', 'Fleece'] as const;
export type FabricLayer = (typeof fabricLayers)[number];

export const fabricLayerLabels: Record<FabricLayer, string> = {
  Upper: 'Верх',
  Lining: 'Підкладка',
  Insulation: 'Утеплювач',
  Fleece: 'Фліс',
};

/** A planned part of an item: one fabric, colour and layer of its saved (or today's) plan. */
export interface FabricPlanPart {
  fabricCode: string;
  color: string;
  colorKey: string;
  layer: FabricLayer;
  planned: number;
  /** The plan of the products cut that issues covered. */
  covered: number;
  issued: number;
  /** Still held for the item; 0 unless the order is «Нове». */
  reserved: number;
  stockId: number | null;
  stockMeters: number;
  stockAvailable: number;
  /** Plan minus covered. */
  missing: number;
}

export interface FabricIssueLine {
  id: number;
  purpose: FabricIssuePurpose;
  planFabricCode: string | null;
  planColorKey: string | null;
  plannedMeters: number | null;
  stockId: number;
  fabricCode: string;
  fabricName: string;
  color: string;
  meters: number;
  coveredMeters: number;
  layer: FabricLayer | null;
  note: string | null;
  /** Every movement of the line is «Скасовано». */
  isVoided: boolean;
}

/** Plan and fact of one planned part in an issue by cutting. */
export interface FabricIssueComparison {
  planFabricCode: string;
  planColorKey: string;
  color: string;
  plan: number;
  actual: number;
  /** Fact minus plan; positive is overspending. */
  difference: number;
  perProduct: number;
}

export interface FabricIssue {
  id: number;
  issuedOn: string;
  note: string | null;
  createdByName: string;
  createdAt: string;
  isReversed: boolean;
  reversedAt: string | null;
  reversedByName: string | null;
  reverseReason: string | null;
  /** Products cut; null for issues recorded before issues by cutting. */
  issuedQuantity: number | null;
  comparison: FabricIssueComparison[];
  lines: FabricIssueLine[];
}

/** The fabric card of an order item: plan by part, issues, and whether the person may issue. */
export interface ItemFabric {
  orderId: number;
  itemId: number;
  orderNumber: number;
  clientName: string;
  modelName: string;
  orderVersion: number;
  isOpen: boolean;
  fabricCode: string | null;
  fabricName: string | null;
  quantity: number;
  hasNorm: boolean;
  /** 0 while the plan follows today's norm; the first issue saves it. */
  planVersion: number;
  planMissing: string | null;
  plan: FabricPlanPart[];
  issued: number;
  issues: FabricIssue[];
  canIssue: boolean;
}

/** An item of an open order found for «Видача на завдання». */
export interface FabricIssueItem {
  orderId: number;
  orderNumber: number;
  clientName: string;
  itemId: number;
  modelName: string;
  fabricCode: string | null;
  fabricName: string | null;
  quantity: number;
}

export interface FabricIssueItems {
  items: FabricIssueItem[];
  hasMore: boolean;
}

export interface CreateItemIssueBody {
  operationId: string;
  orderVersion: number;
  planVersion: number;
  issuedOn: string;
  issuedQuantity: number;
  note: string | null;
  lines: {
    fabricCode: string;
    color: string;
    expectedVersion: string | null;
    meters: number;
    planFabricCode: string | null;
    planColorKey: string | null;
    layer: FabricLayer | null;
    note: string | null;
  }[];
}

export interface RefreshItemPlanBody {
  orderVersion: number;
  planVersion: number;
}
