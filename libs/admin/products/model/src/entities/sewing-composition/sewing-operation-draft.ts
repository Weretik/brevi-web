export interface SewingOperationDraft {
  clientId: string;
  operationId: number;
  quantity: number;
  manualMinutes: number | null;
  sortOrder: number;
  reviewed: boolean;
}
