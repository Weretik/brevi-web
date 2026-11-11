import {
  FABRIC_STOCK_FORM_TEXT_MAX_LENGTH,
  FABRIC_STOCK_MAX_METERS,
  FABRIC_STOCK_NOTE_MAX_LENGTH,
  FABRIC_STOCK_REASON_MAX_LENGTH,
  FABRIC_STOCK_REASON_MIN_LENGTH,
} from '../../entities/operations/stock-operation';

/** «12,5» or «12.5» as metres with at most two decimals; null when it is not such a number. */
export function parseStockMeters(value: string): number | null {
  const text = value.trim().replace(/\s/g, '').replace(',', '.');
  if (!/^-?\d+(\.\d{1,2})?$/.test(text)) return null;
  const meters = Number(text);
  return Math.abs(meters) <= FABRIC_STOCK_MAX_METERS ? meters : null;
}

/** The server takes operation dates from 1900-01-01 to 2100-12-31. */
export function operationDateError(value: string): string | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value)))
    return 'Вкажіть дату операції.';
  return value < '1900-01-01' || value > '2100-12-31'
    ? 'Дата — від 01.01.1900 до 31.12.2100.'
    : undefined;
}

export const positiveMetersError = (value: string) => {
  const meters = parseStockMeters(value);
  return meters === null || meters <= 0
    ? 'Метри — число більше нуля, до двох знаків після коми.'
    : undefined;
};

export const formTextError = (value: string) =>
  value.trim().length > FABRIC_STOCK_FORM_TEXT_MAX_LENGTH
    ? `Не довше ${FABRIC_STOCK_FORM_TEXT_MAX_LENGTH} символів.`
    : undefined;

export const noteError = (value: string) =>
  value.trim().length > FABRIC_STOCK_NOTE_MAX_LENGTH
    ? `Не довше ${FABRIC_STOCK_NOTE_MAX_LENGTH} символів.`
    : undefined;

/** «Уточнити» and «Сторно» need a reason of 3…500 characters. */
export function stockReasonError(value: string): string | undefined {
  const length = value.trim().length;
  return length < FABRIC_STOCK_REASON_MIN_LENGTH || length > FABRIC_STOCK_REASON_MAX_LENGTH
    ? `Причина — від ${FABRIC_STOCK_REASON_MIN_LENGTH} до ${FABRIC_STOCK_REASON_MAX_LENGTH} символів.`
    : undefined;
}

/**
 * «Уточнити» enters the counted total. It may not create or deepen a shortage: the new total is
 * not below min(0, current total). −10 → −5 is fine, −10 → −12 is not.
 */
export function adjustmentTargetError(value: string, current: number): string | undefined {
  const target = parseStockMeters(value);
  if (target === null) return 'Фактичний залишок — число, до двох знаків після коми.';
  if (target === current) return 'Фактичний залишок такий самий, як на складі.';
  if (target < Math.min(0, current))
    return current < 0
      ? 'Уточнення не може збільшити нестачу.'
      : 'Уточнення не може зробити залишок відʼємним.';
  return undefined;
}
