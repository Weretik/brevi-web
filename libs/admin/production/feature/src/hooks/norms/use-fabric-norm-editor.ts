import { useSaveFabricNormMutation } from '@admin/production/data-access';
import {
  createFabricNormFormValues,
  fabricNormBody,
  validateFabricNorm,
} from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { ProductionEditorMode } from '../staff/use-workshop-employee-editor';
import type { FabricNormErrors, FabricNormField, FabricNormRow } from '@admin/production/model';

export function useFabricNormEditor(
  initialMode: Exclude<ProductionEditorMode, 'create'>,
  row: FabricNormRow,
  onSaved: () => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState(() => createFabricNormFormValues(row.norm));
  const [errors, setErrors] = useState<FabricNormErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saveNorm, state] = useSaveFabricNormMutation();

  function change(field: FabricNormField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, norm: undefined }));
  }

  async function save() {
    if (state.isLoading || mode === 'view') return;
    const validation = validateFabricNorm(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      await saveNorm({ modelCode: row.modelCode, norm: fabricNormBody(values) }).unwrap();
      onSaved();
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти норму.'));
    }
  }

  return {
    mode,
    values,
    errors,
    message,
    saving: state.isLoading,
    change,
    save,
    enableEditing: () => setMode('edit'),
  };
}
