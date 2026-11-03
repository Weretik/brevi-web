import type {
  PpeCreateFieldErrors,
  PpeCreateFormValues,
} from '../../forms/ppe-create/ppe-create-form';

/** State of the site code check: not asked yet, waiting, free, taken, or the check failed. */
export type PpeCodeCheckState = 'idle' | 'checking' | 'available' | 'taken' | 'unknown';

export interface PpeCreateReadinessItem {
  label: string;
  done: boolean;
  /** «Перевірено вручну» can wait until after the product is created. */
  optional: boolean;
}

/** The «Готовність» checklist of the page «Новий ЗІЗ»; `errors` are all rule errors of the form. */
export function ppeCreateReadiness(
  values: PpeCreateFormValues,
  errors: PpeCreateFieldErrors,
  codeState: PpeCodeCheckState,
): PpeCreateReadinessItem[] {
  const item = (label: string, done: boolean, optional = false) => ({ label, done, optional });
  return [
    item('Назва і унікальний артикул', !errors.name && !errors.code && codeState === 'available'),
    item('Розділ і одиниця', !errors.sectionId && !errors.unit),
    item('Постачальник зі списку', !errors.supplierId),
    item('Посилання постачальника', !errors.supplierUrl),
    item('Ціна постачальника більша за 0', !errors.supplierPrice),
    item('Правило націнки', !errors.ruleCode),
    item('Перевірено вручну (можна пізніше)', values.isVerified, true),
  ];
}

/**
 * «Створити ЗІЗ» is allowed when every rule passes and the code is not known to be taken. A failed
 * check does not block: the server answers 409 for a taken code anyway.
 */
export function canCreatePpe(errors: PpeCreateFieldErrors, codeState: PpeCodeCheckState) {
  return Object.keys(errors).length === 0 && codeState !== 'taken' && codeState !== 'checking';
}
