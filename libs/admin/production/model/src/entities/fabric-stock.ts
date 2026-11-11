export const FABRIC_STOCK_COLOR_MAX_LENGTH = 80;
export const FABRIC_STOCK_NOTE_MAX_LENGTH = 1000;
export const FABRIC_STOCK_MAX_METERS = 1_000_000;
export const FABRIC_ISSUE_MAX_LINES = 20;

export const fabricIssuePurposes = ['Planned', 'Replacement', 'Additional'] as const;
export type FabricIssuePurpose = (typeof fabricIssuePurposes)[number];

export const fabricIssuePurposeLabels: Record<FabricIssuePurpose, string> = {
  Planned: 'Планова',
  Replacement: 'Заміна',
  Additional: 'Додаткова',
};

export interface FabricStockFabricChoice {
  id: number;
  code: string;
  name: string;
}

/** Offers of «Тканини» and colours of «Кольори» for the «Видача» form of an item. */
export interface FabricStockChoices {
  fabrics: FabricStockFabricChoice[];
  colors: string[];
}

export interface FabricPlanPart {
  fabricCode: string;
  color: string;
  colorKey: string;
  planned: number;
  covered: number;
  issued: number;
  reserved: number;
  stockId: number | null;
  stockMeters: number;
  stockAvailable: number;
}

export interface FabricIssueLine {
  id: number;
  purpose: FabricIssuePurpose;
  planColorKey: string | null;
  plannedMeters: number | null;
  stockId: number;
  fabricCode: string;
  fabricName: string;
  color: string;
  meters: number;
  coveredMeters: number;
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
  lines: FabricIssueLine[];
}

/** Tab «Тканина» of an item. */
export interface ProductionItemFabric {
  orderId: number;
  itemId: number;
  orderVersion: number;
  fabricCode: string | null;
  fabricName: string | null;
  quantity: number;
  hasNorm: boolean;
  plan: FabricPlanPart[];
  issued: number;
  issues: FabricIssue[];
  canIssue: boolean;
}

export interface CreateFabricIssueBody {
  orderVersion: number;
  issuedOn: string;
  note: string | null;
  lines: {
    purpose: FabricIssuePurpose;
    planColorKey: string | null;
    fabricId: number;
    color: string;
    meters: number;
  }[];
}
