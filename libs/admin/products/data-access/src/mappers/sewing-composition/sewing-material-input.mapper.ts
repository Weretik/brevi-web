import type { SewingMaterialDraft } from '@admin/products/model';
import type { operations } from '@admin/shared/contracts';

type MaterialInput =
  operations['replaceSewingComposition']['requestBody']['content']['application/json']['materials'][number];

export function mapSewingMaterialInput(line: SewingMaterialDraft): MaterialInput {
  return {
    kind: line.kind,
    referenceId: line.referenceId,
    costCode: line.costCode,
    quantity: line.quantity,
    unit: line.unit,
    sortOrder: line.sortOrder,
    comment: line.comment.trim() || null,
  };
}
