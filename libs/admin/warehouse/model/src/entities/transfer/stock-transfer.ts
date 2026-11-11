/** A row of a D1 table of the old «Цех», its columns in camelCase. */
export type V133Row = Readonly<Record<string, string | number | null>>;

/** The tables of the export the transfer reads, in the order of the contract. */
export interface StockTransferInput {
  snapshot: string | null;
  fabricStock: V133Row[];
  fabricStockMovements: V133Row[];
  fabricMovementRevisions: V133Row[];
  fabricIssueBatches: V133Row[];
  fabricIssueLines: V133Row[];
  fabricIssueComponents: V133Row[];
  fabricReservations: V133Row[];
  productionOrders: V133Row[];
  productionItems: V133Row[];
}

export type StockTransferTable = Exclude<keyof StockTransferInput, 'snapshot'>;

/** Rows of the export and its control numbers. */
export interface StockTransferSource {
  lines: number;
  pairs: number;
  movements: number;
  openings: number;
  receipts: number;
  issues: number;
  adjustments: number;
  voided: number;
  revisions: number;
  packages: number;
  issueLines: number;
  reservations: number;
  meters: number;
  negativePairs: number;
  zeroPairs: number;
}

/** What Brevi gets. */
export interface StockTransferTarget {
  lines: number;
  movements: number;
  revisions: number;
  issues: number;
  issueLines: number;
  plans: number;
  meters: number;
}

/** The Brevi stock now; `own…` were entered in Brevi itself and will be lost. */
export interface StockTransferCurrent {
  lines: number;
  movements: number;
  issues: number;
  plans: number;
  ownLines: number;
  ownMovements: number;
  ownIssues: number;
}

export interface StockTransferProblem {
  table: string;
  rowId: string | null;
  message: string;
}

/** What the transfer did, or would do on a check. */
export interface StockTransferResult {
  applied: boolean;
  unchanged: boolean;
  hash: string;
  source: StockTransferSource;
  target: StockTransferTarget | null;
  current: StockTransferCurrent;
  needsConfirmation: boolean;
  errors: StockTransferProblem[];
  notes: StockTransferProblem[];
  lastTransferAt: string | null;
}
