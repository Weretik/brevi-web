import { useCreateFabricIssueMutation } from '@admin/production/data-access';
import {
  createFabricIssueValues,
  fabricIssueBody,
  hasFabricIssueErrors,
  todayIso,
  validateFabricIssue,
} from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  FabricIssueErrors,
  FabricIssueFormValues,
  FabricStockFabricChoice,
  ProductionItemFabric,
} from '@admin/production/model';

/** One «Видача» package of an item. */
export function useFabricIssue(
  fabric: ProductionItemFabric,
  fabrics: readonly FabricStockFabricChoice[],
  onSaved: (message: string) => void,
) {
  const itemFabricId = fabrics.find((x) => x.code === fabric.fabricCode)?.id ?? null;
  const [values, setValues] = useState(() =>
    createFabricIssueValues(fabric, itemFabricId, todayIso()),
  );
  const [errors, setErrors] = useState<FabricIssueErrors>({ line: {} });
  const [message, setMessage] = useState<string | null>(null);
  const [create, state] = useCreateFabricIssueMutation();
  const codeOf = (fabricId: number | null) => fabrics.find((x) => x.id === fabricId)?.code ?? null;

  function change(next: FabricIssueFormValues) {
    setValues(next);
    setErrors({ line: {} });
  }

  async function save() {
    if (state.isLoading) return;
    const validation = validateFabricIssue(values, fabric, codeOf);
    setErrors(validation);
    if (hasFabricIssueErrors(validation)) return;
    setMessage(null);
    try {
      await create({
        orderId: fabric.orderId,
        itemId: fabric.itemId,
        body: fabricIssueBody(values, fabric.orderVersion),
      }).unwrap();
      onSaved('Тканину видано.');
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося видати тканину.'));
    }
  }

  return { itemFabricId, values, errors, message, saving: state.isLoading, change, save };
}
