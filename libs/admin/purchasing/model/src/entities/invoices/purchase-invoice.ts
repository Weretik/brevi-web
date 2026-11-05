/** A link from the sheet to an original document; only safe (HTTPS Dropbox) links are opened. */
export interface PurchaseInvoiceLink {
  id: string;
  url: string;
  safe: boolean;
}

export const purchaseInvoiceStates = ['NeedsReview', 'AwaitingRecognition'] as const;
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
  reviewNote: string | null;
  reviewVersion: number;
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
