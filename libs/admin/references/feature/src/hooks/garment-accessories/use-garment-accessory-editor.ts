import {
  useCreateGarmentAccessoryMutation,
  useUpdateGarmentAccessoryMutation,
} from '@admin/references/data-access';
import { validateGarmentAccessory } from '@admin/references/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import { useSuppliers } from '../suppliers/use-suppliers';

import type {
  GarmentAccessoryField,
  GarmentAccessoryFieldErrors,
  GarmentAccessoryFormValues,
  GarmentAccessory,
} from '@admin/references/model';

export type GarmentAccessoryEditorMode = 'create' | 'view' | 'edit';

function initialValues(
  accessory: GarmentAccessory | null,
  nextId: number,
): GarmentAccessoryFormValues {
  return {
    id: String(accessory?.id ?? nextId),
    name: accessory?.name ?? '',
    supplierName: accessory?.supplierName ?? '',
    price: accessory ? String(accessory.price) : '',
  };
}

export function useGarmentAccessoryEditor(
  initialMode: GarmentAccessoryEditorMode,
  accessory: GarmentAccessory | null,
  nextId: number,
  onSaved: () => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState(() => initialValues(accessory, nextId));
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

  function change(field: GarmentAccessoryField, value: string) {
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
      const body = {
        name: values.name.trim(),
        supplierName: values.supplierName,
        price: Number(values.price),
      };
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
