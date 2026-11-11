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

/** «Зведення витрати» over a period by operation date. */
export interface FabricConsumption {
  from: string;
  to: string;
  rows: FabricConsumptionRow[];
  received: number;
  issued: number;
  issuedValue: number | null;
}
