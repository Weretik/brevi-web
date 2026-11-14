import { PRODUCTION_TEXT_MAX_LENGTH } from '../../entities/orders/production-tracking';

import type { CreateProductionShipmentBody } from '../../entities/orders/production-tracking';

export interface ProductionShipmentFormValues {
  quantity: string;
  shippedOn: string;
  comment: string;
}

export type ProductionShipmentErrors = Partial<Record<keyof ProductionShipmentFormValues, string>>;

/** The rest of the item and today, so a full shipment is one press. */
export const createShipmentFormValues = (
  remaining: number,
  today: string,
): ProductionShipmentFormValues => ({
  quantity: String(remaining),
  shippedOn: today,
  comment: '',
});

export function validateShipment(
  values: ProductionShipmentFormValues,
  remaining: number,
): ProductionShipmentErrors {
  const errors: ProductionShipmentErrors = {};
  const quantity = Number(values.quantity.trim());
  if (!/^\d+$/.test(values.quantity.trim()) || quantity < 1)
    errors.quantity = 'Вкажіть ціле число від 1.';
  else if (quantity > remaining) errors.quantity = `Залишилось відвантажити ${remaining} шт.`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.shippedOn)) errors.shippedOn = 'Вкажіть дату.';
  if (values.comment.trim().length > PRODUCTION_TEXT_MAX_LENGTH)
    errors.comment = `Не довше ${PRODUCTION_TEXT_MAX_LENGTH} символів.`;
  return errors;
}

export const shipmentBody = (
  values: ProductionShipmentFormValues,
  version: number,
): CreateProductionShipmentBody => ({
  version,
  quantity: Number(values.quantity.trim()),
  shippedOn: values.shippedOn,
  comment: values.comment.trim() || null,
});

/** «Скасувати» needs a reason. */
export function validateCancelReason(reason: string) {
  const value = reason.trim();
  if (!value) return 'Вкажіть причину скасування.';
  if (value.length > PRODUCTION_TEXT_MAX_LENGTH)
    return `Не довше ${PRODUCTION_TEXT_MAX_LENGTH} символів.`;
  return null;
}
