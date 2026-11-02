import { useCreateFabricMutation, useUpdateFabricMutation } from '@admin/references/data-access';
import { createFabricFormValues, validateFabric } from '@admin/references/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import { useSuppliers } from '../suppliers/use-suppliers';

import type {
  Fabric,
  FabricEditorMode,
  FabricField,
  FabricFieldErrors,
  FabricFormValues,
} from '@admin/references/model';

export type { FabricEditorMode } from '@admin/references/model';

const optional = (value: string) => value.trim() || null;

function fabricBody(values: FabricFormValues) {
  return {
    name: values.name.trim(),
    providerName: values.providerName,
    price: Number(values.price),
    code: optional(values.code),
    nameRu: optional(values.nameRu),
    composition: optional(values.composition),
    compositionRu: optional(values.compositionRu),
    density: optional(values.density),
    isActive: values.isActive,
    comment: optional(values.comment),
    proposalDescription: optional(values.proposalDescription),
  };
}

export function useFabricEditor(
  initialMode: FabricEditorMode,
  fabric: Fabric | null,
  nextId: number,
  onSaved: () => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState(() => createFabricFormValues(fabric, nextId));
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

  function change(field: FabricField, value: string | boolean) {
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
      const body = fabricBody(values);
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
