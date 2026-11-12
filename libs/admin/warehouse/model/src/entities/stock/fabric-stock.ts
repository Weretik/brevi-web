import type { FabricMovementKind } from '../movements/fabric-movement';

/** Who may record stock operations and who sees the prices of «Тканини». */
export interface FabricStockPermissions {
  canMove: boolean;
  seesValue: boolean;
  /** «Перенесення з v133»: Admin. */
  canTransfer: boolean;
}

/** A stock line inside a pair: its own fabric code and balance. */
export interface FabricStockSource {
  id: number;
  fabricCode: string;
  meters: number;
}

/** A fabric and colour on the shelf: every line of the alias group with that colour summed. */
export interface FabricStockColor {
  color: string;
  colorKey: string;
  /** May be below zero: a real issue is never refused for a shortage. */
  meters: number;
  /** Changes whenever any line of the pair changes; «Уточнити» and «Разова витрата» send it back. */
  version: string;
  sources: FabricStockSource[];
  /** «У броні»: what open production plans still need of this pair. */
  booked: number;
  /** «Вільно»: metres − booked; below zero when the stock does not cover the plans. */
  free: number;
  /** What to buy for the plans, the shortage already there included. */
  toOrder: number;
  /** «Остання операція»: the latest movement that counts; null without one. */
  lastMovement: FabricStockLastMovement | null;
  /** The tasks behind «У броні», oldest order first. */
  bookings: FabricStockBooking[];
}

/** The latest movement of a pair. */
export interface FabricStockLastMovement {
  id: number;
  kind: FabricMovementKind;
  operationDate: string;
  delta: number;
  /** Set when an issue went to a production task. */
  orderNumber: number | null;
  document: string | null;
  supplierName: string | null;
  destination: string | null;
}

/** A task that needs a pair: what is left of its plan and what of it the stock does not cover. */
export interface FabricStockBooking {
  orderId: number;
  orderNumber: number;
  clientName: string;
  modelName: string;
  dueDate: string | null;
  need: number;
  toOrder: number;
}

/** A fabric by its canonical code (FAB-067 → FAB-023, FAB-077 → FAB-078). */
export interface FabricStockFabric {
  fabricCode: string;
  /** Codes of «Тканини» that are this fabric, the canonical first. */
  codes: string[];
  fabricName: string;
  composition: string | null;
  density: string | null;
  meters: number;
  colors: FabricStockColor[];
  /** The supplier of the offer in «Тканини», for the supplier filter. */
  supplier: string | null;
  booked: number;
  free: number;
}

/** «Залишки»: only fabrics and colours that have stock lines, zero and negative included. */
export interface FabricStockList {
  fabrics: FabricStockFabric[];
  meters: number;
  pairs: number;
  /** Pairs below zero. */
  negative: number;
  permissions: FabricStockPermissions;
  /** Pairs whose stock does not cover the open plans. */
  short: number;
}

/** A fabric and colour picked on a form, with what the shelf holds now. */
export interface FabricStockPair {
  fabric: FabricStockFabric;
  color: FabricStockColor;
}
