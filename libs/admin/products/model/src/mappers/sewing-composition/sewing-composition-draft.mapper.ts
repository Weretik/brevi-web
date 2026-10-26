import type {
  SewingCompositionDraft,
  SewingCompositionView,
  SewingMaterialDraft,
  SewingOperationDraft,
} from '../../entities/sewing-composition';

export function sewingCompositionToDraft(view: SewingCompositionView): SewingCompositionDraft {
  return {
    productId: view.productId,
    articleId: view.articleId,
    modelCode: view.modelCode,
    version: view.version,
    modelMaterials: view.materials
      .filter((material) => material.scope === 'Model')
      .map(toMaterialDraft),
    articleMaterials: view.materials
      .filter((material) => material.scope === 'Article')
      .map(toMaterialDraft),
    operations: view.operations.map(toOperationDraft),
  };
}
function toMaterialDraft(
  material: SewingCompositionView['materials'][number],
): SewingMaterialDraft {
  return {
    clientId: `material-${material.id}`,
    kind: material.kind,
    referenceId: material.referenceId,
    costCode: material.costCode,
    quantity: material.quantity,
    unit: material.unit,
    required: material.required,
    sortOrder: material.sortOrder,
    reviewed: material.reviewed,
  };
}
function toOperationDraft(
  operation: SewingCompositionView['operations'][number],
): SewingOperationDraft {
  return {
    clientId: `operation-${operation.id}`,
    operationId: operation.operationId,
    quantity: operation.quantity,
    manualMinutes: operation.manualMinutes,
    sortOrder: operation.sortOrder,
    reviewed: operation.reviewed,
  };
}
