export interface SewingOperationDraft {
  clientId: string;
  operationId: number;
  quantity: number;
  manualMinutes: number | null;
  sortOrder: number;
  /** Free note, as the sheet's «Коментар»; empty when none. */
  comment: string;
}
