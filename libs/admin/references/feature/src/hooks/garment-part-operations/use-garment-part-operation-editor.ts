import {
  useCreateGarmentPartOperationMutation,
  useUpdateGarmentPartOperationMutation,
} from '@admin/references/data-access';
import {
  createGarmentPartOperationFormValues,
  garmentPartOperationRequestBody,
  validateGarmentPartOperation,
} from '@admin/references/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import { useGarmentParts } from '../garment-parts/use-garment-parts';

import type {
  GarmentPartOperation,
  GarmentPartOperationEditorMode,
  GarmentPartOperationField,
  GarmentPartOperationFieldErrors,
} from '@admin/references/model';

export type { GarmentPartOperationEditorMode } from '@admin/references/model';

export function useGarmentPartOperationEditor(
  initialMode: GarmentPartOperationEditorMode,
  operation: GarmentPartOperation | null,
  nextId: number,
  onSaved: () => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState(() =>
    createGarmentPartOperationFormValues(operation, nextId),
  );
  const [errors, setErrors] = useState<GarmentPartOperationFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [createGarmentPartOperation, createState] = useCreateGarmentPartOperationMutation();
  const [updateGarmentPartOperation, updateState] = useUpdateGarmentPartOperationMutation();
  const saving = createState.isLoading || updateState.isLoading;
  const groups = useGarmentParts();

  function change(field: GarmentPartOperationField, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateGarmentPartOperation(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      const body = garmentPartOperationRequestBody(values);
      const id = Number(values.id);
      if (mode === 'create') await createGarmentPartOperation({ id, ...body }).unwrap();
      else await updateGarmentPartOperation({ id, body }).unwrap();
      onSaved();
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти операцію.'));
    }
  }

  return {
    mode,
    values,
    errors,
    message,
    saving,
    groups: groups.rows,
    groupsLoading: groups.loading,
    groupsError: groups.error,
    retryGroups: groups.reload,
    change,
    save,
    enableEditing: () => setMode('edit'),
  };
}
