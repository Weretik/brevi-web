import type { SewingOperationDraft } from '../../entities/sewing-composition';

export function emptySewingOperation(clientId: string, sortOrder: number): SewingOperationDraft {
  return { clientId, operationId: 0, quantity: 1, manualMinutes: null, sortOrder, reviewed: false };
}
