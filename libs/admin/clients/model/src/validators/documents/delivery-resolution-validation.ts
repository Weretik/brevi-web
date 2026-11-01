import type {
  DeliveryResolutionDraft,
  DeliveryResolutionErrors,
} from '../../forms/documents/delivery-resolution-draft';

export function deliveryResolutionErrors(value: DeliveryResolutionDraft): DeliveryResolutionErrors {
  const errors: DeliveryResolutionErrors = {};
  if (value.outcome !== 'sent' && value.outcome !== 'not_sent')
    errors.outcome = 'Оберіть перевірений результат.';
  if (
    !value.evidenceNote.trim() ||
    value.evidenceNote.length > 1000 ||
    /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]/.test(value.evidenceNote)
  )
    errors.evidenceNote = 'Опишіть перевірку звичайним текстом до 1000 символів.';
  return errors;
}
