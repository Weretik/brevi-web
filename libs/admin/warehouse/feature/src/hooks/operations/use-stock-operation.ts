import { adminApiErrorMessage } from '@admin/shared/api-client';
import { hasStockFormErrors } from '@admin/warehouse/model';
import { useState } from 'react';

import type { FabricStockOperationResult } from '@admin/warehouse/model';

interface Options<Values, Errors extends object, Body> {
  initial: () => Values;
  validate: (values: Values) => Errors;
  /** null when the form still lacks what the body needs (the pair left the stock). */
  body: (values: Values, operationId: string) => Body | null;
  send: (body: Body) => Promise<FabricStockOperationResult>;
  fallback: string;
  onSaved: (result: FabricStockOperationResult, values: Values) => void;
}

const newOperationId = () => crypto.randomUUID();

/**
 * One stock form: a new operation id per form, kept across failed tries so a lost answer is
 * replayed by the server instead of moving the stock twice; a saved operation starts a new id.
 */
export function useStockOperation<Values, Errors extends object, Body>({
  initial,
  validate,
  body,
  send,
  fallback,
  onSaved,
}: Options<Values, Errors, Body>) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Errors>({} as Errors);
  const [message, setMessage] = useState<string | null>(null);
  const [operationId, setOperationId] = useState(newOperationId);
  const [saving, setSaving] = useState(false);

  function change(next: Values) {
    setValues(next);
    setErrors({} as Errors);
  }

  async function save() {
    if (saving) return;
    const validation = validate(values);
    setErrors(validation);
    if (hasStockFormErrors(validation)) return;
    const request = body(values, operationId);
    if (!request) return;
    setMessage(null);
    setSaving(true);
    try {
      const result = await send(request);
      setOperationId(newOperationId());
      onSaved(result, values);
    } catch (error) {
      setMessage(adminApiErrorMessage(error, fallback));
    } finally {
      setSaving(false);
    }
  }

  return { values, errors, message, saving, change, reset: setValues, save };
}

/** «Цю операцію вже записано» when the server replays a saved operation id. */
export const operationMessage = (result: FabricStockOperationResult, saved: string) =>
  result.replayed ? 'Цю операцію вже записано раніше: склад не змінився вдруге.' : saved;
