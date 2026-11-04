import { useCreateFabricMovementMutation } from '@admin/production/data-access';
import {
  createFabricReceiptValues,
  fabricReceiptBody,
  formatMeters,
  todayIso,
  validateFabricReceipt,
} from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  FabricReceiptErrors,
  FabricReceiptFormValues,
  FabricStockRow,
} from '@admin/production/model';

/**
 * «Прихід» or «Початковий залишок». `versionOf` gives the version of the line this fabric and
 * colour already have, or null when the movement will create it.
 */
export function useFabricReceipt(
  line: FabricStockRow | null,
  versionOf: (fabricId: number, color: string) => number | null,
  onSaved: (message: string) => void,
) {
  const [values, setValues] = useState(() => createFabricReceiptValues(todayIso(), line));
  const [errors, setErrors] = useState<FabricReceiptErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [create, state] = useCreateFabricMovementMutation();

  function change(next: FabricReceiptFormValues) {
    setValues(next);
    setErrors({});
  }

  async function save() {
    if (state.isLoading) return;
    const validation = validateFabricReceipt(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    const version = line ? line.version : versionOf(values.fabricId ?? 0, values.color);
    try {
      const saved = await create(fabricReceiptBody(values, version)).unwrap();
      onSaved(
        `${saved.line.fabricCode} · ${saved.line.color}: тепер ${formatMeters(saved.line.meters)}.`,
      );
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти рух.'));
    }
  }

  return { values, errors, message, saving: state.isLoading, change, save };
}
