import {
  useCreateGarmentAccessoryMutation,
  useUpdateGarmentAccessoryMutation,
} from '@admin/references/data-access';
import {
  createGarmentAccessoryFormValues,
  validateGarmentAccessory,
} from '@admin/references/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import { useSuppliers } from '../suppliers/use-suppliers';

import type {
  GarmentAccessoryField,
  GarmentAccessoryFieldErrors,
  GarmentAccessoryFormValues,
  GarmentAccessory,
  GarmentAccessoryEditorMode,
} from '@admin/references/model';

export type { GarmentAccessoryEditorMode } from '@admin/references/model';

const optional = (value: string) => value.trim() || null;

function accessoryBody(values: GarmentAccessoryFormValues) {
  return {
    name: values.name.trim(),
    supplierName: values.supplierName,
    price: Number(values.price),
    code: optional(values.code),
    unit: values.unit,
    isActive: values.isActive,
    comment: optional(values.comment),
  };
}

export function useGarmentAccessoryEditor(
  initialMode: GarmentAccessoryEditorMode,
  accessory: GarmentAccessory | null,
  nextId: number,
  onSaved: () => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState(() => createGarmentAccessoryFormValues(accessory, nextId));
  const [errors, setErrors] = useState<GarmentAccessoryFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [createGarmentAccessory, createState] = useCreateGarmentAccessoryMutation();
  const [updateGarmentAccessory, updateState] = useUpdateGarmentAccessoryMutation();
  const saving = createState.isLoading || updateState.isLoading;
  const {
    rows: suppliers,
    loading: suppliersLoading,
    error: supplierError,
    reload: retrySuppliers,
  } = useSuppliers();

  function change(field: GarmentAccessoryField, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateGarmentAccessory(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      const body = accessoryBody(values);
      if (mode === 'create')
        await createGarmentAccessory({ id: Number(values.id), ...body }).unwrap();
      else await updateGarmentAccessory({ id: Number(values.id), body }).unwrap();
      onSaved();
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти фурнітуру.'));
    }
  }

  return {
    mode,
    values,
    errors,
    message,
    saving,
    suppliers,
    suppliersLoading,
    supplierError,
    change,
    save,
    retrySuppliers,
    enableEditing: () => setMode('edit'),
  };
}
