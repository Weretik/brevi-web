import {
  useCreateFabricColorMutation,
  useUpdateFabricColorMutation,
} from '@admin/references/data-access';
import {
  createFabricColorFormValues,
  fabricColorBody,
  validateFabricColor,
} from '@admin/references/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  FabricColor,
  FabricColorField,
  FabricColorFieldErrors,
  FabricColorFormValues,
  PricingEditorMode,
} from '@admin/references/model';

/** Create, view and edit of one colour; `others` are the rest of the list for the duplicate check. */
export function useFabricColorEditor(
  initialMode: PricingEditorMode,
  color: FabricColor | null,
  others: readonly FabricColor[],
  newSortOrder: number,
  onSaved: () => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState(() => createFabricColorFormValues(color));
  const [errors, setErrors] = useState<FabricColorFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [create, createState] = useCreateFabricColorMutation();
  const [update, updateState] = useUpdateFabricColorMutation();
  const saving = createState.isLoading || updateState.isLoading;

  function change<Field extends FabricColorField>(field: Field, value: FabricColorFormValues[Field]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateFabricColor(
      values,
      others.filter((other) => other.id !== color?.id),
    );
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      const body = fabricColorBody(values, color?.sortOrder ?? newSortOrder);
      if (color) await update({ id: color.id, body }).unwrap();
      else await create(body).unwrap();
      onSaved();
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти колір.'));
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
