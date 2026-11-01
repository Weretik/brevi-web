import {
  quoteDate,
  quoteInteger,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';

import type { components } from '@admin/shared/contracts';

type DeliveryDto = components['schemas']['QuoteDeliveryDetail'];
type ResolutionDto = components['schemas']['QuoteDeliveryManualResolution'];

export function parseDeliveryResolution(
  value: unknown,
  state: DeliveryDto['status'],
  attempt: number,
): ResolutionDto | null {
  if (value == null) return null;
  const row = quoteRecord(value);
  const outcome = row['outcome'];
  if (
    (outcome !== 'sent' && outcome !== 'not_sent') ||
    (outcome === 'sent' ? state !== 'succeeded' : state !== 'failed')
  )
    throw new Error('Ручний результат не відповідає стану спроби.');
  const evidenceNote = quoteText(row['evidenceNote']);
  if (
    !evidenceNote.trim() ||
    evidenceNote.length > 1000 ||
    /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]/.test(evidenceNote)
  )
    throw new Error('Некоректний опис перевірки.');
  const resolvedAttempt = quoteInteger(row['attempt']);
  if (attempt !== resolvedAttempt) throw new Error('Результат іншої спроби.');
  return {
    outcome,
    actorId: quoteInteger(row['actorId']),
    attempt: resolvedAttempt,
    evidenceNote,
    createdAt: quoteDate(row['createdAt']),
  };
}
