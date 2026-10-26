import type { SewingOperationDraft } from '@admin/products/model';
import type { operations } from '@admin/shared/contracts';

type OperationInput =
  operations['replaceSewingComposition']['requestBody']['content']['application/json']['operations'][number];

export function mapSewingOperationInput(line: SewingOperationDraft): OperationInput {
  return {
    operationId: line.operationId,
    quantity: line.quantity,
    manualMinutes: line.manualMinutes,
    sortOrder: line.sortOrder,
    reviewed: line.reviewed,
  };
}
