import type { SupplierDraft } from '@admin/references/data-access';

export type SupplierField = keyof SupplierDraft;
export type SupplierFieldErrors = Partial<Record<SupplierField, string>>;

export function validateSupplier(draft: SupplierDraft): SupplierFieldErrors {
  const errors: SupplierFieldErrors = {};
  if (!Number.isInteger(draft.id) || draft.id <= 0)
    errors.id = 'ID має бути додатним цілим числом.';
  if (!draft.name.trim()) errors.name = 'Вкажіть назву.';
  else if (draft.name.trim().length > 200) errors.name = 'Назва не може перевищувати 200 символів.';
  if (draft.link.length > 2048) errors.link = 'Посилання не може перевищувати 2048 символів.';
  if (draft.contactPerson.length > 200)
    errors.contactPerson = 'Контактна особа не може перевищувати 200 символів.';
  if (draft.notes.length > 500) errors.notes = 'Нотатки не можуть перевищувати 500 символів.';
  return errors;
}
