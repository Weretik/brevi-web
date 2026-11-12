export interface FabricConsumptionRow {
  stockId: number;
  fabricCode: string;
  fabricName: string;
  color: string;
  received: number;
  issued: number;
  corrected: number;
  issuedValue: number | null;
  /** Issued to items of orders; part of `issued`. */
  issuedToTasks: number;
  /** «Разова витрата»; part of `issued`. */
  oneOff: number;
}

/** «Витрата за період» by operation date. */
export interface FabricConsumption {
  from: string;
  to: string;
  rows: FabricConsumptionRow[];
  received: number;
  issued: number;
  issuedValue: number | null;
  issuedToTasks: number;
  oneOff: number;
  corrected: number;
}
