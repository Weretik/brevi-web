import { materialUnitForKind } from '../../queries/sewing-composition/sewing-material-defaults';

import type { SewingMaterialDraft } from '../../entities/sewing-composition';

export function validateSewingMaterials(
  materials: readonly SewingMaterialDraft[],
  scope: 'Model' | 'Article',
): Record<string, string> {
  const errors: Record<string, string> = {};
  materials.forEach((material, index) => {
    const prefix = `${scope === 'Model' ? 'modelMaterials' : 'articleMaterials'}.${index}`;
    if (!Number.isFinite(material.quantity) || material.quantity <= 0)
      errors[`${prefix}.quantity`] = 'Вкажіть кількість більше нуля.';
    const accessoryMetres = material.kind === 'Accessory' && material.unit === 'Metre';
    if (material.unit !== materialUnitForKind(material.kind) && !accessoryMetres)
      errors[`${prefix}.unit`] = 'Оберіть одиницю, що відповідає типу матеріалу.';
    if (material.kind === 'OtherCost') {
      if (!material.costCode?.trim()) errors[`${prefix}.costCode`] = 'Вкажіть код витрати.';
      if (material.referenceId !== null)
        errors[`${prefix}.referenceId`] = 'Для витрати не обирають довідник.';
    } else if (!material.referenceId || material.referenceId < 1)
      errors[`${prefix}.referenceId`] = 'Оберіть позицію з довідника.';
    if (material.comment.trim().length > 500)
      errors[`${prefix}.comment`] = 'Коментар — до 500 символів.';
  });
  return errors;
}
