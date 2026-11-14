const REASON_MAX_LENGTH = 1000;

/** «Сторно» or a cancellation in the workshop needs a reason; null when it is fine. */
export function validateStockReason(reason: string): string | null {
  const value = reason.trim();
  if (!value) return 'Вкажіть причину.';
  return value.length > REASON_MAX_LENGTH ? `Не довше ${REASON_MAX_LENGTH} символів.` : null;
}
