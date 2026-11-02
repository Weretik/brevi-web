import {
  useCreatePricingParameterMutation,
  useUpdatePricingParameterMutation,
} from '@admin/references/data-access';
import {
  createPricingParameterFormValues,
  pricingParameterBody,
  validatePricingParameter,
} from '@admin/references/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  PricingEditorMode,
  PricingParameter,
  PricingParameterField,
  PricingParameterFieldErrors,
} from '@admin/references/model';

export function usePricingParameterEditor(
  initialMode: PricingEditorMode,
  parameter: PricingParameter | null,
  newSortOrder: number,
  onSaved: () => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState(() => createPricingParameterFormValues(parameter));
  const [errors, setErrors] = useState<PricingParameterFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [create, createState] = useCreatePricingParameterMutation();
  const [update, updateState] = useUpdatePricingParameterMutation();
  const saving = createState.isLoading || updateState.isLoading;

  function change(field: PricingParameterField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validatePricingParameter(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      const body = pricingParameterBody(values, parameter?.sortOrder ?? newSortOrder);
      if (parameter) await update({ id: parameter.id, body }).unwrap();
      else await create({ code: values.code.trim(), ...body }).unwrap();
      onSaved();
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти параметр.'));
    }
  }

  return {
    mode,
    values,
    errors,
    message,
    saving,
    change,
    save,
    enableEditing: () => setMode('edit'),
  };
}
