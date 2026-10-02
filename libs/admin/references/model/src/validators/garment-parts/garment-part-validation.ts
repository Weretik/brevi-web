export interface GarmentPartDraft {
  id: number;
  name: string;
}

export type GarmentPartField = keyof GarmentPartDraft;
export type GarmentPartFieldErrors = Partial<Record<GarmentPartField, string>>;

export function validateGarmentPart(draft: GarmentPartDraft): GarmentPartFieldErrors {
  const errors: GarmentPartFieldErrors = {};
  if (!Number.isInteger(draft.id) || draft.id <= 0)
    errors.id = 'ID має бути додатним цілим числом.';
  if (!draft.name.trim()) errors.name = 'Вкажіть назву.';
  else if (draft.name.trim().length > 150) errors.name = 'Назва не може перевищувати 150 символів.';
  return errors;
}
