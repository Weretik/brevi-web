import {
  sewingMaterialKey,
  sewingOperationKey,
} from '../../queries/sewing-card/sewing-material-lines';

import type { SewingArticleSummary } from '../../entities/sewing-card/sewing-article-summary';
import type { SewingCompositionDraft } from '../../entities/sewing-composition';

/** The shared composition of the card response as `replaceSewingComposition` sends it (CAT-016). */
export function sewingCardToDraft(card: SewingArticleSummary): SewingCompositionDraft {
  return {
    productId: card.productId,
    modelCode: card.modelCode,
    version: card.version,
    modelMaterials: [...card.materials]
      .sort((left, right) => left.sortOrder - right.sortOrder || left.id - right.id)
      .map((line) => ({
        clientId: sewingMaterialKey(line.id),
        kind: line.kind,
        referenceId: line.referenceId,
        costCode: line.costCode,
        quantity: line.quantity,
        unit: line.unit,
        sortOrder: line.sortOrder,
        comment: line.comment,
      })),
    operations: [...card.operations]
      .sort((left, right) => left.sortOrder - right.sortOrder || left.id - right.id)
      .map((line) => ({
        clientId: sewingOperationKey(line.id),
        operationId: line.operationId,
        quantity: line.quantity,
        manualMinutes: line.manualMinutes,
        sortOrder: line.sortOrder,
        comment: line.comment,
      })),
  };
}
