import {
  useCreateGarmentPartOperationMutation,
  useUpdateGarmentPartOperationMutation,
} from '@admin/references/data-access';
import { validateGarmentPartOperation } from '@admin/references/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  GarmentPartOperationDraft,
  GarmentPartOperationField,
  GarmentPartOperationFieldErrors,
  GarmentPartOperation,
} from '@admin/references/model';

export type GarmentPartOperationEditorMode = 'create' | 'view' | 'edit';

export function useGarmentPartOperationEditor(
  initialMode: GarmentPartOperationEditorMode,
  operation: GarmentPartOperation | null,
  nextId: number,
  onSaved: () => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [draft, setDraft] = useState<GarmentPartOperationDraft>({
    id: operation?.id ?? nextId,
    garmentPartName: operation?.garmentPartName ?? '',
    name: operation?.name ?? '',
    min: operation ? String(operation.min) : '0',
  });
  const [errors, setErrors] = useState<GarmentPartOperationFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [createGarmentPartOperation, createState] = useCreateGarmentPartOperationMutation();
  const [updateGarmentPartOperation, updateState] = useUpdateGarmentPartOperationMutation();
  const saving = createState.isLoading || updateState.isLoading;

  function change(field: GarmentPartOperationField, value: string) {
    setDraft((current) => ({ ...current, [field]: field === 'id' ? Number(value) : value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateGarmentPartOperation(draft);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      const body = {
        garmentPartName: draft.garmentPartName.trim(),
        name: draft.name.trim(),
        min: Number(draft.min),
      };
      if (mode === 'create') await createGarmentPartOperation({ id: draft.id, ...body }).unwrap();
      else await updateGarmentPartOperation({ id: draft.id, body }).unwrap();
      onSaved();
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти роботу.'));
    }
  }

  return {
    mode,
    draft,
    errors,
    message,
    saving,
    change,
    save,
    enableEditing: () => setMode('edit'),
  };
}
