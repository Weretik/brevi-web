import {
  canCreatePpe,
  ppeCodeTakenMessage,
  ppeCreateFormDefaults,
  ppeCreateReadiness,
  validatePpeCreate,
} from '@admin/products/model';
import { useMemo, useState } from 'react';

import { usePpeCodeCheck } from './use-ppe-code-check';

import type {
  PpeCreateField,
  PpeCreateFieldErrors,
  PpeCreateFormValues,
} from '@admin/products/model';

const codeNotes = { checking: 'Перевіряємо артикул…', available: 'Артикул вільний.' } as const;

/**
 * Values of «Новий ЗІЗ» with their rules: an error shows once its field was changed, a taken code
 * shows at once, and a server error stays until the user edits that field.
 */
export function usePpeCreateForm() {
  const [values, setValues] = useState<PpeCreateFormValues>(ppeCreateFormDefaults);
  const [touched, setTouched] = useState<ReadonlySet<PpeCreateField>>(() => new Set());
  const [serverErrors, setServerErrors] = useState<PpeCreateFieldErrors>({});
  const ruleErrors = useMemo(() => validatePpeCreate(values), [values]);
  const code = usePpeCodeCheck(values.code);

  const errors: PpeCreateFieldErrors = {};
  for (const field of touched) if (ruleErrors[field]) errors[field] = ruleErrors[field];
  if (code.state === 'taken' && !ruleErrors.code)
    errors.code = ppeCodeTakenMessage(code.takenByName);
  Object.assign(errors, serverErrors);

  return {
    values,
    ruleErrors,
    errors,
    codeNote:
      code.state === 'checking' || code.state === 'available' ? codeNotes[code.state] : null,
    readiness: ppeCreateReadiness(values, ruleErrors, code.state),
    canSubmit: canCreatePpe(ruleErrors, code.state),
    setServerErrors,
    change<Field extends PpeCreateField>(field: Field, value: PpeCreateFormValues[Field]) {
      setValues((current) => ({ ...current, [field]: value }));
      setTouched((current) => (current.has(field) ? current : new Set(current).add(field)));
      setServerErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
    },
  };
}
