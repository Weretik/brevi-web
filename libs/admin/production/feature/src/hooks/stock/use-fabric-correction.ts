import { useCorrectFabricStockMutation } from '@admin/production/data-access';
import {
  createFabricCorrectionValues,
  fabricCorrectionBody,
  todayIso,
  validateFabricCorrection,
} from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  FabricCorrectionErrors,
  FabricCorrectionFormValues,
  FabricStockRow,
} from '@admin/production/model';

/** «Коригування» of a line to what was counted on the shelf. */
export function useFabricCorrection(line: FabricStockRow, onSaved: (message: string) => void) {
  const [values, setValues] = useState(() => createFabricCorrectionValues(line.meters, todayIso()));
  const [errors, setErrors] = useState<FabricCorrectionErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [correct, state] = useCorrectFabricStockMutation();

  function change(next: FabricCorrectionFormValues) {
    setValues(next);
    setErrors({});
  }

  async function save() {
    if (state.isLoading || line.id === null) return;
    const validation = validateFabricCorrection(values, line.meters);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      await correct({ id: line.id, body: fabricCorrectionBody(values, line.version) }).unwrap();
      onSaved('Залишок скориговано.');
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося скоригувати залишок.'));
    }
  }

  return { values, errors, message, saving: state.isLoading, change, save };
}
