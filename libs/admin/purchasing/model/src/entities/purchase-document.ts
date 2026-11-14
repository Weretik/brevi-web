export const purchaseDocumentVats = ['WithVat', 'WithoutVat'] as const;
/** «З ПДВ» only when VAT is clearly printed; otherwise «Без ПДВ». */
export type PurchaseDocumentVat = (typeof purchaseDocumentVats)[number];

export const purchaseDocumentSources = ['Ai', 'Manual'] as const;
export type PurchaseDocumentSource = (typeof purchaseDocumentSources)[number];

export const purchaseRecognitionResults = [
  'Recognized',
  'NeedsReview',
  'Failed',
  'Skipped',
] as const;
export type PurchaseRecognitionResult = (typeof purchaseRecognitionResults)[number];

/** One position as printed; decimals stay strings, exactly as saved. */
export interface PurchaseDocumentItem {
  position: number;
  name: string;
  quantity: string;
  unit: string | null;
  /** With VAT when the document's prices include it. */
  price: string;
  sum: string;
}

/** Checked facts of one original: read by AI and checked in kopecks, or uploaded as JSON. */
export interface PurchaseDocument {
  documentType: string;
  documentNumber: string;
  /** YYYY-MM-DD. */
  documentDate: string;
  supplierName: string;
  vat: PurchaseDocumentVat;
  pricesIncludeVat: boolean;
  vatAmount: string | null;
  totalPayable: string;
  items: readonly PurchaseDocumentItem[];
  source: PurchaseDocumentSource;
  model: string | null;
  checkedBy: string;
  checkedAt: string;
}

/** The last «Розпізнати» of a file that has no checked facts yet. */
export interface PurchaseRecognitionAttempt {
  result: PurchaseRecognitionResult;
  problems: readonly string[];
  model: string | null;
  costUsd: number;
  by: string;
  at: string;
}

export interface PurchaseRecognition {
  fileId: string;
  result: PurchaseRecognitionResult;
  problems: readonly string[];
  model: string | null;
  costUsd: number;
}

/** One batch of «Розпізнати всі нові». */
export interface PurchaseRecognitionBatch {
  recognized: number;
  needsReview: number;
  failed: number;
  skipped: number;
  remaining: number;
  costUsd: number;
  stopReason: string | null;
}

export interface PurchaseDocumentSave {
  fileId: string;
  unchanged: boolean;
  replaced: boolean;
}

export interface PurchaseDocumentUpload {
  fileId: string;
  /** The parsed JSON file; the server checks it. */
  document: unknown;
  replace: boolean;
}
