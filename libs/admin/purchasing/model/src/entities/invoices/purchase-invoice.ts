import type { PurchaseDocument, PurchaseRecognitionAttempt } from './purchase-document';

/** A link from the sheet to an original document; only safe (HTTPS Dropbox) links are opened. */
export interface PurchaseInvoiceLink {
  id: string;
  url: string;
  safe: boolean;
  /** Checked facts; null until recognised or uploaded. */
  document: PurchaseDocument | null;
  /** The last recognition while there are no facts. */
  recognition: PurchaseRecognitionAttempt | null;
}

/** Recognized is never shown as a badge: only problems are marked. */
export const purchaseInvoiceStates = ['NeedsReview', 'AwaitingRecognition', 'Recognized'] as const;
export type PurchaseInvoiceState = (typeof purchaseInvoiceStates)[number];

/**
 * One card of «Рахунки на закупку»: a Telegram message from the sheet «финансы» with its
 * representative row (smallest row number), links, payment mark and problems.
 */
export interface PurchaseInvoice {
  messageId: string;
  telegramKey: string;
  sourceUid: string;
  rowNumber: number;
  sourceRowCount: number;
  chatName: string | null;
  fromUser: string | null;
  /** The DateTime cell exactly as written in the sheet. */
  messageAt: string | null;
  text: string;
  statusOriginal: string;
  markAt: string | null;
  markBy: string | null;
  /** Status «СПЛАЧЕНО» in the sheet: a note, not a payment. */
  markedPaid: boolean;
  supplierId: number | null;
  /** Name of the linked supplier; null when none or the supplier no longer exists. */
  supplierName: string | null;
  reviewNote: string | null;
  /** Sent back with the next review save. */
  reviewVersion: number;
  /** E-mail of who last changed the supplier link or note. */
  reviewedBy: string | null;
  reviewedAt: string | null;
  state: PurchaseInvoiceState;
  issues: readonly string[];
  links: readonly PurchaseInvoiceLink[];
}

export interface PurchaseInvoicePage {
  items: readonly PurchaseInvoice[];
  total: number;
  page: number;
  pageSize: number;
}
