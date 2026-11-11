import type { FabricStockPermissions } from '../stock/fabric-stock';

export const FABRIC_MOVEMENTS_PAGE_SIZE = 50;

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
  Issue: 'Витрата',
  Adjustment: 'Уточнення',
  Reversal: 'Сторно',
};

/** «Усі / Прихід / Витрата»; Opening lists the openings not taken back. */
export const fabricMovementFilters = ['All', 'Receipt', 'Issue', 'Opening'] as const;
export type FabricMovementFilter = (typeof fabricMovementFilters)[number];

/** A row of «Рух тканини». */
export interface FabricMovementRow {
  id: number;
  stockId: number;
  kind: FabricMovementKind;
  /** The day the fabric really came or went. */
  operationDate: string;
  /** When the movement was recorded. */
  createdAt: string;
  /** Code of the line moved. */
  fabricCode: string;
  /** The fabric the stock shows. */
  groupCode: string;
  fabricName: string;
  color: string;
  supplierName: string | null;
  document: string | null;
  orderId: number | null;
  itemId: number | null;
  orderNumber: number | null;
  modelName: string | null;
  /** «Куди використано» of an issue without an order. */
  destination: string | null;
  delta: number;
  /** Balance of that line after the movement. */
  metersAfter: number;
  /** «На 1 виріб»: metres per product cut for an issue by cutting; null otherwise. */
  perProduct: number | null;
  note: string | null;
  createdByName: string;
  isReversed: boolean;
  reversesMovementId: number | null;
  canReverse: boolean;
  /** «Скасовано»: kept in the history with no effect on the balance. */
  isVoided: boolean;
  /** Edits, voids and restores so far; sent back as the expected revision. */
  revision: number;
  /** Edit, «Скасувати» and «Історія правок» are offered. */
  canEdit: boolean;
}

export interface FabricMovementPage {
  rows: FabricMovementRow[];
  page: number;
  hasMore: boolean;
  permissions: FabricStockPermissions;
}

export const fabricMovementRevisionActions = ['Edit', 'Void', 'Restore'] as const;
export type FabricMovementRevisionAction = (typeof fabricMovementRevisionActions)[number];

export const fabricMovementRevisionActionLabels: Record<FabricMovementRevisionAction, string> = {
  Edit: 'Правка',
  Void: 'Скасування',
  Restore: 'Скасування правки',
};

/** A movement before or after a revision. */
export interface FabricMovementState {
  fabricCode: string;
  color: string;
  operationDate: string;
  delta: number;
  supplierName: string | null;
  document: string | null;
  destination: string | null;
  isVoided: boolean;
}

export interface FabricMovementRevision {
  id: number;
  number: number;
  action: FabricMovementRevisionAction;
  before: FabricMovementState;
  after: FabricMovementState;
  reason: string | null;
  createdByName: string;
  createdAt: string;
  /** Taken back by a later «Скасувати останню правку». */
  isUndone: boolean;
}

/** «Історія правок» of a movement, newest first. */
export interface FabricMovementHistory {
  movementId: number;
  revision: number;
  canRestore: boolean;
  revisions: FabricMovementRevision[];
}
