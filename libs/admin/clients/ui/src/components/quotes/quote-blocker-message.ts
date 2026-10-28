const messages: Readonly<Record<string, string>> = {
  MissingPublication: 'Для артикула немає опублікованої ціни.',
  MissingArticle: 'Артикул не знайдено.',
  InactiveArticle: 'Артикул неактивний.',
  InvalidPublicationBasis: 'Опублікована ціна не має повної основи розрахунку.',
  StalePublicationBasis: 'Опублікована ціна не відповідає поточному складу артикула.',
  MissingProduct: 'Товар не знайдено.',
  InactiveProduct: 'Товар неактивний.',
  MissingOffer: 'Немає пропозиції постачальника.',
  UnapprovedOffer: 'Пропозицію постачальника ще не підтверджено.',
  MissingSupplierCost: 'Не вказана закупівельна вартість.',
  MissingRule: 'Немає підтвердженого правила ціни СІЗ.',
  AmbiguousRule: 'Для СІЗ знайдено кілька несумісних правил ціни.',
  InvalidMarkup: 'Правило націнки потребує виправлення.',
  InvalidAmount: 'Вихідна сума некоректна.',
  NumericOverflow: 'Сума перевищує допустиму точність розрахунку.',
};
export function quoteBlockerMessage(code: string): string {
  return messages[code] ?? 'Джерело не дозволяє розрахувати ціну. Перевірте вибір.';
}
