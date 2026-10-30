import {
  quoteDate,
  quoteId,
  quoteInteger,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';

import type { QuoteDeliveryView } from '@admin/clients/model';
import type { components } from '@admin/shared/contracts';

type Dto = components['schemas']['QuoteDeliveryDetail'];
export function mapQuoteDelivery(value: unknown): QuoteDeliveryView {
  const row = quoteRecord(value);
  const state = row['status'];
  if (
    state !== 'queued' &&
    state !== 'sending' &&
    state !== 'reconciling' &&
    state !== 'unknown' &&
    state !== 'succeeded' &&
    state !== 'failed'
  )
    throw new Error('Невідомий стан надсилання.');
  const confirmedAt = row['confirmedAt'] == null ? null : quoteDate(row['confirmedAt']);
  if ((state === 'succeeded') !== (confirmedAt !== null))
    throw new Error('Непідтверджений результат надсилання.');
  const recipient = quoteText(row['recipientAddress']);
  if (!recipient || recipient.length > 254 || /[\r\n]/.test(recipient))
    throw new Error('Некоректний одержувач.');
  const error = row['errorCode'] == null ? null : quoteText(row['errorCode']);
  if (error !== null && !/^[A-Za-z0-9_]{1,80}$/.test(error))
    throw new Error('Некоректна помилка надсилання.');
  const dto = {
    deliveryId: quoteId(row['deliveryId']),
    quoteId: quoteId(row['quoteId']),
    versionId: quoteId(row['versionId']),
    artifactId: quoteId(row['artifactId']),
    emailTemplateVersionId: quoteId(row['emailTemplateVersionId']),
    recipientAddress: recipient,
    status: state,
    attempt: quoteInteger(row['attempt'], 0),
    errorCode: error,
    createdAt: quoteDate(row['createdAt']),
    updatedAt: quoteDate(row['updatedAt']),
    confirmedAt,
  } satisfies Dto;
  return {
    id: dto.deliveryId,
    quoteId: dto.quoteId,
    versionId: dto.versionId,
    pdfId: dto.artifactId,
    templateId: dto.emailTemplateVersionId,
    recipient: dto.recipientAddress,
    state: dto.status,
    attempt: dto.attempt,
    error: dto.errorCode,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    confirmedAt: dto.confirmedAt,
  };
}
