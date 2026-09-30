export interface GarmentPartOperationDraft {
  id: number;
  garmentPartName: string;
  name: string;
  min: string;
}

export type GarmentPartOperationField = keyof GarmentPartOperationDraft;
export type GarmentPartOperationFieldErrors = Partial<Record<GarmentPartOperationField, string>>;

export function validateGarmentPartOperation(
  draft: GarmentPartOperationDraft,
): GarmentPartOperationFieldErrors {
  const errors: GarmentPartOperationFieldErrors = {};
  if (!Number.isInteger(draft.id) || draft.id <= 0)
    errors.id = 'ID має бути додатним цілим числом.';
  if (!draft.garmentPartName.trim()) errors.garmentPartName = 'Оберіть елемент виробу.';
  else if (draft.garmentPartName.trim().length > 150)
    errors.garmentPartName = 'Назва елемента не може перевищувати 150 символів.';
  if (!draft.name.trim()) errors.name = 'Вкажіть назву.';
  else if (draft.name.trim().length > 255) errors.name = 'Назва не може перевищувати 255 символів.';
  if (!draft.min.trim() || !Number.isFinite(Number(draft.min)) || Number(draft.min) < 0)
    errors.min = 'Вкажіть невід’ємну кількість хвилин.';
  return errors;
}
