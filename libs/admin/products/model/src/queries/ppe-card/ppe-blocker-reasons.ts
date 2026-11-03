/** Reasons a PPE price cannot be calculated, in the words of the sheet instructions. */
const reasons: Record<string, string> = {
  InactiveProduct: 'Товар вимкнено',
  MissingOffer: 'Немає ціни постачальника',
  MissingSupplierCost: 'Немає ціни постачальника',
  UnapprovedOffer: 'Ціну постачальника не підтверджено',
  MissingRule: 'Не вибрано правило ціноутворення',
  AmbiguousRule: 'Правило ціноутворення неоднозначне',
  InvalidMarkup: 'Неправильні відсотки правила',
  InvalidAmount: 'Неправильна ціна',
  NumericOverflow: 'Завелика ціна',
};

export const ppeReadyStatus = 'Готово до розрахунку';

export function ppeBlockerReasons(codes: readonly string[]): string[] {
  return [...new Set(codes.map((code) => reasons[code] ?? 'Ціну не розраховано'))];
}
