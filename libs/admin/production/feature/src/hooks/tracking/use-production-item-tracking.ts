import {
  useCancelProductionShipmentMutation,
  useCreateProductionShipmentMutation,
  useSetProductionItemStagesMutation,
} from '@admin/production/data-access';
import {
  createShipmentFormValues,
  shipmentBody,
  todayIso,
  toggleStage,
  validateShipment,
} from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  ProductionItem,
  ProductionOrder,
  ProductionShipmentErrors,
  ProductionShipmentFormValues,
  ProductionStage,
} from '@admin/production/model';

interface Shipping {
  item: ProductionItem;
  values: ProductionShipmentFormValues;
}

/** Етапи and «Відвантажити» of the items; the server answers with the whole card. */
export function useProductionItemTracking(
  order: ProductionOrder | null,
  onMessage: (message: string) => void,
) {
  const [setStages, settingStages] = useSetProductionItemStagesMutation();
  const [createShipment, creating] = useCreateProductionShipmentMutation();
  const [cancelShipment, cancelling] = useCancelProductionShipmentMutation();
  const [shipping, setShipping] = useState<Shipping | null>(null);
  const [errors, setErrors] = useState<ProductionShipmentErrors>({});
  const [message, setMessage] = useState<string | null>(null);

  async function toggle(item: ProductionItem, stage: ProductionStage) {
    if (!order) return;
    try {
      await setStages({
        id: order.id,
        itemId: item.id,
        version: order.version,
        stages: toggleStage(item.stages, stage),
      }).unwrap();
    } catch (error) {
      onMessage(adminApiErrorMessage(error, 'Не вдалося змінити етапи.'));
    }
  }

  function openShipping(item: ProductionItem) {
    setShipping({
      item,
      values: createShipmentFormValues(item.quantity - item.shippedQuantity, todayIso()),
    });
    setErrors({});
    setMessage(null);
  }

  async function ship() {
    if (!order || !shipping) return;
    const remaining = shipping.item.quantity - shipping.item.shippedQuantity;
    const found = validateShipment(shipping.values, remaining);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setMessage(null);
    try {
      await createShipment({
        id: order.id,
        itemId: shipping.item.id,
        body: shipmentBody(shipping.values, order.version),
      }).unwrap();
      setShipping(null);
      onMessage('Відвантаження записано.');
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося записати відвантаження.'));
    }
  }

  async function cancel(shipmentId: number) {
    if (!order) return;
    try {
      await cancelShipment({ id: order.id, shipmentId, version: order.version }).unwrap();
      onMessage('Відвантаження скасовано.');
    } catch (error) {
      onMessage(adminApiErrorMessage(error, 'Не вдалося скасувати відвантаження.'));
    }
  }

  return {
    busy: settingStages.isLoading || creating.isLoading || cancelling.isLoading,
    shipping,
    errors,
    message,
    saving: creating.isLoading,
    toggle,
    openShipping,
    changeShipping: (values: ProductionShipmentFormValues) =>
      setShipping((current) => (current ? { ...current, values } : current)),
    closeShipping: () => setShipping(null),
    ship,
    cancel,
  };
}
