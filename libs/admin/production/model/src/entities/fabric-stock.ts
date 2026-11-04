export const FABRIC_STOCK_COLOR_MAX_LENGTH = 80;
export const FABRIC_STOCK_NOTE_MAX_LENGTH = 1000;
export const FABRIC_STOCK_DOCUMENT_MAX_LENGTH = 200;
export const FABRIC_STOCK_MAX_METERS = 1_000_000;
export const FABRIC_ISSUE_MAX_LINES = 20;

export const fabricMovementKinds = [
  'Opening',
  'Receipt',
  'Issue',
  'Adjustment',
  'Reversal',
] as const;
export type FabricMovementKind = (typeof fabricMovementKinds)[number];

export const fabricMovementKindLabels: Record<FabricMovementKind, string> = {
  Opening: 'Початковий залишок',
  Receipt: 'Прихід',
  Issue: 'Видача',
  Adjustment: 'Коригування',
  Reversal: 'Сторно',
};

export const fabricIssuePurposes = ['Planned', 'Replacement', 'Additional'] as const;
export type FabricIssuePurpose = (typeof fabricIssuePurposes)[number];

export const fabricIssuePurposeLabels: Record<FabricIssuePurpose, string> = {
  Planned: 'Планова',
  Replacement: 'Заміна',
  Additional: 'Додаткова',
};

export interface FabricStockPermissions {
  canMove: boolean;
  seesValue: boolean;
}

/** A line of «Склад тканин»; `id` is null for a planned fabric and colour the stock never held. */
export interface FabricStockRow {
  id: number | null;
  fabricId: number | null;
  fabricCode: string;
  fabricName: string;
  color: string;
  /** Balance; may be below zero. */
  meters: number;
  reserved: number;
  available: number;
  price: number | null;
  value: number | null;
  version: number;
  updatedAt: string | null;
}

export interface FabricStockTotals {
  meters: number;
  reserved: number;
  lines: number;
  short: number;
  value: number | null;
}

export interface FabricStockList {
  rows: FabricStockRow[];
  totals: FabricStockTotals;
  permissions: FabricStockPermissions;
}

export interface FabricMovement {
  id: number;
  kind: FabricMovementKind;
  metersBefore: number;
  delta: number;
  metersAfter: number;
  operationDate: string;
  note: string | null;
  supplierId: number | null;
  supplierName: string | null;
  document: string | null;
  orderId: number | null;
  orderNumber: number | null;
  modelName: string | null;
  reversesMovementId: number | null;
  isReversed: boolean;
  canReverse: boolean;
  createdByName: string;
  createdAt: string;
}

export interface FabricReservation {
  orderId: number;
  orderNumber: number;
  itemId: number;
  modelName: string;
  planned: number;
  covered: number;
  reserved: number;
}

export interface FabricStockLine {
  line: FabricStockRow;
  movements: FabricMovement[];
  reservations: FabricReservation[];
  permissions: FabricStockPermissions;
}

export interface FabricStockFabricChoice {
  id: number;
  code: string;
  name: string;
}

export interface FabricStockChoices {
  fabrics: FabricStockFabricChoice[];
  suppliers: { id: number; name: string }[];
}

export interface CreateFabricMovementBody {
  kind: 'Opening' | 'Receipt';
  fabricId: number;
  color: string;
  meters: number;
  operationDate: string;
  supplierId: number | null;
  document: string | null;
  note: string | null;
  version: number | null;
}

export interface CorrectFabricStockBody {
  version: number;
  countedMeters: number;
  operationDate: string;
  note: string;
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

export interface FabricConsumptionRow {
  stockId: number;
  fabricCode: string;
  fabricName: string;
  color: string;
  received: number;
  issued: number;
  corrected: number;
  issuedValue: number | null;
}

export interface FabricConsumption {
  from: string;
  to: string;
  rows: FabricConsumptionRow[];
  received: number;
  issued: number;
  issuedValue: number | null;
}

/** fabric-stock.json from the old «Цех», sent to the server as it is. */
export interface FabricStockImportFile {
  stocks: unknown[];
  issues: unknown[];
  oldReservations: unknown[];
}
