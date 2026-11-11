import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useIssueFabricToItemMutation } from '@admin/warehouse/data-access';
import {
  createItemIssueValues,
  hasItemIssueErrors,
  itemIssueBody,
  itemIssuePreview,
  kyivToday,
  validateItemIssue,
} from '@admin/warehouse/model';
import { useState } from 'react';

import type {
  FabricStockFabric,
  ItemFabric,
  ItemIssueErrors,
  ItemIssueFormValues,
} from '@admin/warehouse/model';

const newOperationId = () => crypto.randomUUID();

/**
 * «Видача» by actual cutting in two steps: the form, then a check of plan and fact and the pairs
 * before and after; «Записати» sends one package. The operation id lives as long as the form, so a
 * lost answer is replayed by the server instead of moving the stock twice.
 */
export function useItemIssue(
  card: ItemFabric,
  fabrics: readonly FabricStockFabric[],
  onSaved: (message: string) => void,
) {
  const [values, setValues] = useState(() => createItemIssueValues(card, fabrics, kyivToday()));
  const [errors, setErrors] = useState<ItemIssueErrors>({ line: {} });
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [operationId] = useState(newOperationId);
  const [issue, state] = useIssueFabricToItemMutation();

  function change(next: ItemIssueFormValues) {
    setValues(next);
    setErrors({ line: {} });
  }

  function check() {
    const validation = validateItemIssue(values, card, fabrics);
    setErrors(validation);
    if (!hasItemIssueErrors(validation)) setChecking(true);
  }

  async function save() {
    if (state.isLoading) return;
    const body = itemIssueBody(values, card, fabrics, operationId);
    if (!body) {
      setChecking(false);
      return;
    }
    setMessage(null);
    try {
      await issue({ orderId: card.orderId, itemId: card.itemId, body }).unwrap();
      onSaved('Тканину видано. Залишки й бронь оновлено.');
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося видати тканину.'));
    }
  }

  return {
    values,
    errors,
    message,
    checking,
    preview: checking ? itemIssuePreview(values, card, fabrics) : null,
    saving: state.isLoading,
    change,
    back: () => setChecking(false),
    submit: () => (checking ? save() : check()),
  };
}
