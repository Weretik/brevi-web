export const FABRIC_STOCK_MAX_METERS = 1_000_000;
export const FABRIC_STOCK_FORM_TEXT_MAX_LENGTH = 160;
export const FABRIC_STOCK_NOTE_MAX_LENGTH = 1000;
export const FABRIC_STOCK_REASON_MIN_LENGTH = 3;
export const FABRIC_STOCK_REASON_MAX_LENGTH = 500;

/** Every operation carries a new id per form; a retry with the same id returns the saved result. */
export interface OpenFabricStockBody {
  operationId: string;
  fabricId: number;
  color: string;
  meters: number;
  operationDate: string;
}

export interface ReceiveFabricBody {
  operationId: string;
  fabricId: number;
  color: string;
  meters: number;
  operationDate: string;
  supplierName: string | null;
  document: string | null;
  note: string | null;
}

/** «Разова витрата / без замовлення» of a pair the stock holds. */
export interface IssueFabricBody {
  operationId: string;
  fabricCode: string;
  color: string;
  expectedVersion: string | null;
  meters: number;
  operationDate: string;
  destination: string | null;
  note: string | null;
}

/** «Уточнити»: the counted total of a pair, not the change. */
export interface AdjustFabricStockBody {
  operationId: string;
  fabricCode: string;
  color: string;
  expectedVersion: string;
  targetMeters: number;
  operationDate: string;
  reason: string;
}

/**
 * Edit of one movement. Metres without sign (receipt and issue > 0, opening ≥ 0), a correction keeps its sign.
 * A receipt may move to another offer and colour (fabricId + color), an issue to another held pair (fabricCode + color).
 */
export interface EditFabricMovementBody {
  operationId: string;
  expectedRevision: number;
  operationDate: string;
  meters: number;
  fabricId: number | null;
  fabricCode: string | null;
  color: string | null;
  supplierName: string | null;
  document: string | null;
  destination: string | null;
  reason: string | null;
}

/** «Скасувати»: the movement stays in the history with no effect on the balance. */
export interface VoidFabricMovementBody {
  operationId: string;
  expectedRevision: number;
  reason: string;
}

/** «Скасувати останню правку». */
export interface RestoreFabricMovementBody {
  operationId: string;
  expectedRevision: number;
}

/** The pair after a stock operation. */
export interface FabricStockOperationResult {
  operationId: string | null;
  fabricCode: string;
  color: string;
  meters: number;
  /** The same operation id was saved before; nothing moved now. */
  replayed: boolean;
}
