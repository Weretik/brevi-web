'use server';

import {
  REQUEST_ID_FIELD,
  REQUEST_TRAP_FIELD,
  cleanRequestValues,
  normalizeUkrainianPhone,
  validateRequest,
} from '@site/request/model';
import { siteApiPostForm } from '@site/shared/api-client';

import type { Locale } from '@site/core/i18n';
import type { RequestFormState, RequestFormValues } from '@site/request/model';

const text = (formData: FormData, field: string): string => {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Server Action of the «Заявка» form (LEAD-002): cleans and checks the fields and the file, then posts them to
 * BreviERP, which saves the request for «Заявки з сайту», puts the file on the CDN and lets the bot post it to the
 * managers' Telegram group. When the API cannot take it the answer is `unavailable` and the page asks to call, so no
 * visitor is told that a manager received something that went nowhere. The page binds the locale.
 */
export async function submitRequest(
  locale: Locale,
  _state: RequestFormState,
  formData: FormData,
): Promise<RequestFormState> {
  const values: RequestFormValues = cleanRequestValues({
    phone: text(formData, 'phone'),
    workwear: text(formData, 'workwear'),
    quantity: text(formData, 'quantity'),
    comment: text(formData, 'comment'),
  });
  const file = formData.get('attachment');
  const attachment = file instanceof File && file.size > 0 ? file : undefined;
  const errors = validateRequest(values, attachment);
  if (Object.keys(errors).length > 0) return { status: 'invalid', values, errors };

  const phone = normalizeUkrainianPhone(values.phone) ?? values.phone;
  // A bot that filled the hidden field sees the usual thanks, and nothing reaches the managers.
  if (text(formData, REQUEST_TRAP_FIELD).trim()) return { status: 'sent', phone };

  const body = new FormData();
  body.set('phone', phone);
  if (values.workwear) body.set('workwear', values.workwear);
  if (values.quantity) body.set('quantity', values.quantity);
  if (values.comment) body.set('comment', values.comment);
  body.set('locale', locale);
  // The same form sent again keeps its id, so BreviERP returns the request it already has.
  const requestId = text(formData, REQUEST_ID_FIELD);
  if (UUID.test(requestId)) body.set('requestId', requestId);
  if (attachment) body.set('attachment', attachment, attachment.name);

  const result = await siteApiPostForm('/api/public/site-requests', body);
  return result.kind === 'ok' ? { status: 'sent', phone } : { status: 'unavailable', values };
}
