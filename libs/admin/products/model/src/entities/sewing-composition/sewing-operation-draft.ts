export interface SewingOperationDraft {
  clientId: string;
  operationId: number;
  quantity: number;
  manualMinutes: number | null;
  sortOrder: number;
  reviewed: boolean;
  /** Free note, as the sheet's «Коментар»; empty when none. */
  comment: string;
}
