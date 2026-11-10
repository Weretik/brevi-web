'use server';

import { cleanRequestValues, validateRequest } from '@site/request/model';

import type { RequestFormState, RequestFormValues } from '@site/request/model';

const text = (formData: FormData, field: keyof RequestFormValues): string => {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
};

/**
 * Server Action of the «Заявка» form: cleans and checks the fields and the attached file.
 *
 * Delivery to a manager (the «Ліди» page of BreviERP and the Telegram group) is not connected yet, by the
 * owner's decision of 2026-11-10. Until then a valid request answers `unavailable` and the page asks to call,
 * so no visitor is told that a manager received something that went nowhere.
 */
export async function submitRequest(
  _state: RequestFormState,
  formData: FormData,
): Promise<RequestFormState> {
  const values = cleanRequestValues({
    phone: text(formData, 'phone'),
    workwear: text(formData, 'workwear'),
    quantity: text(formData, 'quantity'),
    comment: text(formData, 'comment'),
  });
  const file = formData.get('attachment');
  const attachment = file instanceof File && file.size > 0 ? file : undefined;
  const errors = validateRequest(values, attachment);
  if (Object.keys(errors).length > 0) return { status: 'invalid', values, errors };

  return { status: 'unavailable', values };
}
