import { useUpdateProductionOrderMutation } from '@admin/production/data-access';
import {
  createProductionItemFormValues,
  orderHeaderValues,
  updateOrderBody,
  validateOrderHeader,
  validateProductionItem,
} from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  ProductionItem,
  ProductionItemErrors,
  ProductionItemFormValues,
  ProductionOrder,
  ProductionOrderHeaderErrors,
  ProductionOrderHeaderValues,
} from '@admin/production/model';

type Editing =
  | { kind: 'header'; values: ProductionOrderHeaderValues }
  | { kind: 'item'; item: ProductionItem; values: ProductionItemFormValues };

/** Edits the order header or one item in a side panel; the server keeps the history. */
export function useProductionOrderEditor(order: ProductionOrder | null, onSaved: () => void) {
  const [editing, setEditing] = useState<Editing | null>(null);
  const [headerErrors, setHeaderErrors] = useState<ProductionOrderHeaderErrors>({});
  const [itemErrors, setItemErrors] = useState<ProductionItemErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [update, updating] = useUpdateProductionOrderMutation();

  function open(next: Editing) {
    setEditing(next);
    setHeaderErrors({});
    setItemErrors({});
    setMessage(null);
  }

  async function save() {
    if (!order || !editing) return;
    let body;
    if (editing.kind === 'header') {
      const found = validateOrderHeader(editing.values);
      setHeaderErrors(found);
      if (Object.keys(found).length > 0) return;
      body = updateOrderBody(order, editing.values, null);
    } else {
      const found = validateProductionItem(editing.values, order.permissions.seesSewingRate);
      setItemErrors(found);
      if (Object.keys(found).length > 0) return;
      body = updateOrderBody(order, orderHeaderValues(order), {
        itemId: editing.item.id,
        values: editing.values,
      });
    }
    setMessage(null);
    try {
      await update({ id: order.id, body }).unwrap();
      setEditing(null);
      onSaved();
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти завдання.'));
    }
  }

  return {
    editing,
    headerErrors,
    itemErrors,
    message,
    saving: updating.isLoading,
    editHeader: () => order && open({ kind: 'header', values: orderHeaderValues(order) }),
    editItem: (item: ProductionItem) =>
      open({ kind: 'item', item, values: createProductionItemFormValues(item) }),
    changeHeader: (values: ProductionOrderHeaderValues) =>
      setEditing((current) => (current?.kind === 'header' ? { ...current, values } : current)),
    changeItem: (values: ProductionItemFormValues) =>
      setEditing((current) => (current?.kind === 'item' ? { ...current, values } : current)),
    close: () => setEditing(null),
    save,
  };
}
