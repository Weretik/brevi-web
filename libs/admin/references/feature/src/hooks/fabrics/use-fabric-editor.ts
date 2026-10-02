import { useCreateFabricMutation, useUpdateFabricMutation } from '@admin/references/data-access';
import { validateFabric } from '@admin/references/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import { useSuppliers } from '../suppliers/use-suppliers';

import type {
  FabricField,
  FabricFieldErrors,
  FabricFormValues,
  Fabric,
} from '@admin/references/model';

export type FabricEditorMode = 'create' | 'view' | 'edit';

function initialValues(fabric: Fabric | null, nextId: number): FabricFormValues {
  return {
    id: String(fabric?.id ?? nextId),
    name: fabric?.name ?? '',
    providerName: fabric?.providerName ?? '',
    price: fabric ? String(fabric.price) : '',
  };
}

export function useFabricEditor(
  initialMode: FabricEditorMode,
  fabric: Fabric | null,
  nextId: number,
  onSaved: () => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState(() => initialValues(fabric, nextId));
  const [errors, setErrors] = useState<FabricFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [createFabric, createState] = useCreateFabricMutation();
  const [updateFabric, updateState] = useUpdateFabricMutation();
  const saving = createState.isLoading || updateState.isLoading;
  const {
    rows: suppliers,
    loading: suppliersLoading,
    error: supplierError,
    reload: retrySuppliers,
  } = useSuppliers();

  function change(field: FabricField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateFabric(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      const body = {
        name: values.name.trim(),
        providerName: values.providerName,
        price: Number(values.price),
      };
      if (mode === 'create') await createFabric({ id: Number(values.id), ...body }).unwrap();
      else await updateFabric({ id: Number(values.id), body }).unwrap();
      onSaved();
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти тканину.'));
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
