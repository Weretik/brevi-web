import type { ProductDraft } from './product-draft.types';

export function validateProductDraft(
  draft: ProductDraft,
  id?: number,
  percentageReferenceIds: readonly number[] = [],
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (id !== undefined && (!Number.isInteger(id) || id < 1))
    errors['id'] = 'Вкажіть додатний цілий ID.';
  for (const [field, label, max] of [
    ['name', 'Українська назва', 200],
    ['ruName', 'Російська назва', 200],
    ['descriptionUk', 'Український опис', 20000],
    ['descriptionRu', 'Російський опис', 20000],
  ] as const) {
    const value = draft[field].trim();
    if (!value) errors[field] = `${label} обов'язкова.`;
    else if (value.length > max) errors[field] = `Максимум ${max} символів.`;
  }
  if (
    new Set(draft.categoryIds).size !== draft.categoryIds.length ||
    draft.categoryIds.some((value) => value < 1)
  )
    errors['categoryIds'] = 'Перевірте категорії.';
  if (
    draft.photos.some(
      (item) => item.mediaFileId < 1 || item.sortOrder < 0 || (item.alt?.length ?? 0) > 200,
    ) ||
    new Set(draft.photos.map((item) => item.mediaFileId)).size !== draft.photos.length ||
    (draft.photos.length > 0 && draft.photos.filter((item) => item.isMain).length !== 1)
  )
    errors['photos'] = 'Фото мають бути унікальними та містити головне.';
  if (
    (draft.informationBlocks ?? []).some(
      (block) =>
        !block.titleUk.trim() ||
        !block.titleRu.trim() ||
        !block.textUk.trim() ||
        !block.textRu.trim() ||
        block.titleUk.length > 200 ||
        block.titleRu.length > 200 ||
        block.textUk.length > 2000 ||
        block.textRu.length > 2000 ||
        block.sortOrder < 0,
    )
  ) {
    errors['informationBlocks'] = 'Заповніть назви й тексти всіх інформаційних блоків.';
  }
  if (
    (draft.characteristicTables ?? []).some(
      (table) =>
        !table.titleUk.trim() ||
        !table.titleRu.trim() ||
        table.titleUk.length > 200 ||
        table.titleRu.length > 200 ||
        table.sortOrder < 0 ||
        table.rows.some(
          (row) =>
            !row.labelUk.trim() ||
            !row.labelRu.trim() ||
            !row.valueUk.trim() ||
            !row.valueRu.trim() ||
            row.labelUk.length > 200 ||
            row.labelRu.length > 200 ||
            row.valueUk.length > 1000 ||
            row.valueRu.length > 1000 ||
            row.sortOrder < 0,
        ),
    )
  ) {
    errors['characteristicTables'] = 'Заповніть назви та рядки таблиць характеристик.';
  }
  if (draft.type === 'Sewing') {
    if (!(draft.metersPerProduct > 0)) errors['metersPerProduct'] = 'Вкажіть метри на виріб.';
    if (
      draft.fabrics.some((item) => item.fabricId < 1 || item.sortOrder < 0) ||
      new Set(draft.fabrics.map((item) => item.fabricId)).size !== draft.fabrics.length ||
      draft.fabrics.filter((item) => item.isPrimary).length > 2 ||
      (draft.fabrics.length === 1 && !draft.fabrics[0].isPrimary)
    )
      errors['fabrics'] = 'Перевірте тканини та основну тканину.';
    if (
      draft.accessories.some(
        (item) => item.garmentAccessoryId < 1 || item.quantity <= 0 || item.sortOrder < 0,
      ) ||
      new Set(draft.accessories.map((item) => item.garmentAccessoryId)).size !==
        draft.accessories.length
    )
      errors['accessories'] = 'Перевірте фурнітуру та кількість.';
    if (
      draft.operationIds.some((id) => id < 1) ||
      new Set(draft.operationIds).size !== draft.operationIds.length
    )
      errors['operationIds'] = 'Операції мають бути унікальними.';
  } else {
    if (!(draft.supplierId > 0)) errors['supplierId'] = 'Оберіть постачальника.';
    if (!(draft.basePrice > 0)) errors['basePrice'] = 'Вкажіть базову ціну.';
    for (const field of ['retailPercent', 'wholesalePercent'] as const) {
      const value = draft[field];
      if (
        value.source === 'Reference'
          ? !(value.additionalReferenceId > 0) ||
            !percentageReferenceIds.includes(value.additionalReferenceId)
          : !Number.isFinite(value.customPercent) || value.customPercent < 0
      ) {
        errors[field] = 'Вкажіть відсоток або довідник.';
      }
    }
  }
  return errors;
}
