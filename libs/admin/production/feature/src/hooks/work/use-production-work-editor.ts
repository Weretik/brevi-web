import { useCreateProductionWorkMutation } from '@admin/production/data-access';
import {
  createProductionWorkValues,
  parseWorkTarget,
  productionWorkBody,
  todayIso,
  validateProductionWork,
  workLeft,
  workTarget,
} from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  ProductionWorkErrors,
  ProductionWorkFormValues,
  WorkChoices,
  WorkItemChoice,
} from '@admin/production/model';

/** «Додати роботу» for a fixed item (from the order card) or any item of a «Нове» order (from the log). */
export function useProductionWorkEditor(
  choices: WorkChoices,
  fixedItem: WorkItemChoice | null,
  onSaved: (message: string) => void,
) {
  const today = todayIso();
  const [values, setValues] = useState(() =>
    createProductionWorkValues(
      today,
      fixedItem ? workTarget(fixedItem.orderId, fixedItem.itemId) : '',
    ),
  );
  const [errors, setErrors] = useState<ProductionWorkErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [create, state] = useCreateProductionWorkMutation();
  const item =
    fixedItem ??
    choices.items.find((x) => workTarget(x.orderId, x.itemId) === values.target) ??
    null;
  const left = item ? workLeft(item, values.kind) : null;

  function change(next: ProductionWorkFormValues) {
    setValues(next);
    setErrors({});
  }

  async function save() {
    if (state.isLoading) return;
    const validation = validateProductionWork(values, today, left);
    setErrors(validation);
    const target = parseWorkTarget(values.target);
    if (Object.keys(validation).length || !target) return;
    setMessage(null);
    try {
      const saved = await create({ ...target, body: productionWorkBody(values) }).unwrap();
      onSaved(
        `${saved.modelName}: пошито ${saved.sewn} з ${saved.quantity}, покроєно ${saved.cut}.`,
      );
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти роботу.'));
    }
  }

  return { values, errors, message, left, today, saving: state.isLoading, change, save };
}
