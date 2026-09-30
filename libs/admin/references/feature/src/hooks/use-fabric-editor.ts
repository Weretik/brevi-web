import { createFabric, FabricApiError, updateFabric } from '@admin/references/data-access';
import { useState } from 'react';

import { useSuppliers } from './use-suppliers';
import { validateFabric } from '../model/fabric-validation';

import type { FabricField, FabricFieldErrors, FabricFormValues } from '../model/fabric-validation';
import type { Fabric } from '@admin/references/data-access';

export type FabricDialogMode = 'create' | 'view' | 'edit';

function initialValues(fabric: Fabric | null, nextId: number): FabricFormValues {
  return {
    id: String(fabric?.id ?? nextId),
    name: fabric?.name ?? '',
    providerName: fabric?.providerName ?? '',
    price: fabric ? String(fabric.price) : '',
  };
}

export function useFabricEditor(
  initialMode: FabricDialogMode,
  fabric: Fabric | null,
  nextId: number,
  onSaved: () => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState(() => initialValues(fabric, nextId));
  const [errors, setErrors] = useState<FabricFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { rows: suppliers, error: supplierError, reload: retrySuppliers } = useSuppliers();

  function change(field: FabricField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateFabric(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setSaving(true);
    setMessage(null);
    try {
      const body = {
        name: values.name.trim(),
        providerName: values.providerName,
        price: Number(values.price),
      };
      if (mode === 'create') await createFabric({ id: Number(values.id), ...body });
      else await updateFabric(Number(values.id), body);
      onSaved();
    } catch (error) {
      if (error instanceof FabricApiError) setErrors(error.fieldErrors);
      setMessage(error instanceof Error ? error.message : 'Не вдалося зберегти тканину.');
    } finally {
      setSaving(false);
    }
  }

  return {
    mode,
    values,
    errors,
    message,
    saving,
    suppliers,
    supplierError,
    change,
    save,
    retrySuppliers,
    enableEditing: () => setMode('edit'),
  };
}
