import type { SewingMaterialDraft, SewingOperationDraft } from '../../entities/sewing-composition';

interface SewingLookupIds {
  fabrics: readonly number[];
  accessories: readonly number[];
  operations: readonly number[];
}
export function validateSewingLookupReferences(
  materials: SewingMaterialDraft[],
  operations: SewingOperationDraft[],
  scope: 'Model' | 'Article',
  lookupIds: SewingLookupIds,
): Record<string, string> {
  const errors: Record<string, string> = {};
  const materialPath = scope === 'Model' ? 'modelMaterials' : 'articleMaterials';
  materials.forEach((material, index) => {
    if (
      material.kind === 'Fabric' &&
      material.referenceId !== null &&
      !lookupIds.fabrics.includes(material.referenceId)
    )
      errors[`${materialPath}.${index}.referenceId`] = 'Тканину не знайдено в довіднику.';
    if (
      material.kind === 'Accessory' &&
      material.referenceId !== null &&
      !lookupIds.accessories.includes(material.referenceId)
    )
      errors[`${materialPath}.${index}.referenceId`] = 'Фурнітуру не знайдено в довіднику.';
  });
  if (scope === 'Model')
    operations.forEach((operation, index) => {
      if (operation.operationId > 0 && !lookupIds.operations.includes(operation.operationId))
        errors[`operations.${index}.operationId`] = 'Операцію не знайдено в довіднику.';
    });
  return errors;
}
