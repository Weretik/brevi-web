export type PriceSourceMethod = 'Website' | 'GoogleSheets' | 'SupplierCabinet' | 'File';
export type PriceFileKind = 'None' | 'InsightYml' | 'CemtoPdf';

export interface PriceImportProblem {
  productCode: string | null;
  productName: string | null;
  message: string;
}

/** One finished import of a source. */
export interface PriceImportRun {
  trigger: string;
  actor: string;
  finishedAt: string;
  checked: number;
  changed: number;
  unchanged: number;
  skipped: number;
  problems: PriceImportProblem[];
}

/** A row of «Імпорт цін»: how a PPE supplier's prices reach Brevi. */
export interface PriceSource {
  key: string;
  title: string;
  method: PriceSourceMethod;
  schedule: string;
  logic: string;
  /** Percent off the supplier price, 0–90. */
  discountPercent: number;
  defaultDiscountPercent: number;
  supplierId: number | null;
  supplierName: string | null;
  productCount: number;
  manualPriceCount: number;
  fileKind: PriceFileKind;
  fileCount: number;
  /** False until the scheduled update for this supplier is connected. */
  automaticUpdateConnected: boolean;
  settingsUpdatedAt: string | null;
  settingsUpdatedBy: string | null;
  lastRun: PriceImportRun | null;
}

export interface PriceSourceList {
  /** Administrators and the director change discounts. */
  canChangeDiscounts: boolean;
  sources: PriceSource[];
}

export type PriceImportStatus =
  'Changed' | 'Unchanged' | 'ManualPrice' | 'Inactive' | 'NotInFile' | 'Invalid';

/** One product of the supplier with its old and new prices. */
export interface PriceImportRow {
  productId: number;
  code: string | null;
  name: string;
  status: PriceImportStatus;
  oldPrice: number | null;
  newPrice: number | null;
  oldWholesale: number | null;
  newWholesale: number | null;
  oldRetail: number | null;
  newRetail: number | null;
  message: string | null;
}

export interface PriceImportResult {
  applied: boolean;
  discountPercent: number;
  checked: number;
  changed: number;
  unchanged: number;
  skipped: number;
  rows: PriceImportRow[];
}
