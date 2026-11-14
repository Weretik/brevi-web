/** The last sheet sync; nulls and zeros before the first one. */
export interface PurchaseSyncState {
  lastSuccessAt: string | null;
  lastAttemptAt: string | null;
  /** Reason of the last failed attempt; null after a success. */
  error: string | null;
  recordCount: number;
  fileCount: number;
}

/** What one «Оновити зараз» changed. */
export interface PurchaseSyncResult {
  recordCount: number;
  fileCount: number;
  messagesAdded: number;
  messagesUpdated: number;
  rowsAdded: number;
  rowsUpdated: number;
  rowsDeactivated: number;
  filesAdded: number;
  filesDeactivated: number;
  syncedAt: string;
}
