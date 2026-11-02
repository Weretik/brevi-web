import {
  useCreatePpeMarkupRuleMutation,
  useUpdatePpeMarkupRuleMutation,
} from '@admin/references/data-access';
import {
  createPpeMarkupRuleFormValues,
  ppeMarkupRuleBody,
  validatePpeMarkupRule,
} from '@admin/references/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  PpeMarkupRule,
  PpeMarkupRuleField,
  PpeMarkupRuleFieldErrors,
  PricingEditorMode,
} from '@admin/references/model';

export function usePpeMarkupRuleEditor(
  initialMode: PricingEditorMode,
  rule: PpeMarkupRule | null,
  newSortOrder: number,
  onSaved: () => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState(() => createPpeMarkupRuleFormValues(rule));
  const [errors, setErrors] = useState<PpeMarkupRuleFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [create, createState] = useCreatePpeMarkupRuleMutation();
  const [update, updateState] = useUpdatePpeMarkupRuleMutation();
  const saving = createState.isLoading || updateState.isLoading;

  function change(field: PpeMarkupRuleField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validatePpeMarkupRule(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      const body = ppeMarkupRuleBody(values, rule?.sortOrder ?? newSortOrder);
      if (rule) await update({ id: rule.id, body }).unwrap();
      else await create({ name: values.name.trim(), ...body }).unwrap();
      onSaved();
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти правило.'));
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
