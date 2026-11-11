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
  note: string | null;
  createdByName: string;
  isReversed: boolean;
  reversesMovementId: number | null;
  canReverse: boolean;
}

export interface FabricMovementPage {
  rows: FabricMovementRow[];
  page: number;
  hasMore: boolean;
  permissions: FabricStockPermissions;
}
