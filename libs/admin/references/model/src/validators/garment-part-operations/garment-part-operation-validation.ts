export interface GarmentPartOperationFormValues {
  id: string;
  code: string;
  garmentPartName: string;
  element: string;
  variant: string;
  name: string;
  min: string;
  minutesPerProduct: boolean;
  normCheckedAt: string;
  isActive: boolean;
  notes: string;
}

export type GarmentPartOperationField = keyof GarmentPartOperationFormValues;
export type GarmentPartOperationFieldErrors = Partial<Record<GarmentPartOperationField, string>>;

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

export function validateGarmentPartOperation(
  values: GarmentPartOperationFormValues,
): GarmentPartOperationFieldErrors {
  const errors: GarmentPartOperationFieldErrors = {};
  const id = Number(values.id);
  const min = Number(values.min);
  if (!Number.isInteger(id) || id <= 0) errors.id = 'Вкажіть додатний цілий ID.';
  if (values.code.trim().length > 20) errors.code = 'Не більше 20 символів.';
  if (!values.garmentPartName.trim()) errors.garmentPartName = 'Оберіть групу деталей.';
  else if (values.garmentPartName.trim().length > 150)
    errors.garmentPartName = 'Не більше 150 символів.';
  if (values.element.trim().length > 150) errors.element = 'Не більше 150 символів.';
  if (values.variant.trim().length > 255) errors.variant = 'Не більше 255 символів.';
  if (!values.name.trim()) errors.name = 'Вкажіть назву.';
  else if (values.name.trim().length > 255) errors.name = 'Не більше 255 символів.';
  if (
    !values.minutesPerProduct &&
    (!values.min.trim() || !Number.isFinite(min) || min <= 0 || min > 10000)
  )
    errors.min = 'Вкажіть норму від 0 до 10000 хв.';
  if (values.normCheckedAt && !isoDate.test(values.normCheckedAt))
    errors.normCheckedAt = 'Вкажіть дату.';
  if (values.notes.trim().length > 1000) errors.notes = 'Не більше 1000 символів.';
  return errors;
}
