import type { QuotePriceSelection } from '../../entities/quotes/quote-price-selection';

function positiveMoney(value: number): boolean {
  return (
    Number.isFinite(value) && value > 0 && value < 1e18 && /^\d+(?:\.\d{1,2})?$/.test(String(value))
  );
}

function validReason(reason: string): boolean {
  return reason.trim().length > 0 && reason.length <= 500;
}

export function quotePriceErrors(selection: QuotePriceSelection): Record<string, string> {
  const errors: Record<string, string> = {};
  if (selection.kind === 'customSewing') {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        selection.versionId,
      ) ||
      /^0{8}-0{4}-0{4}-0{4}-0{12}$/.test(selection.versionId)
    )
      errors['versionId'] = 'Оберіть збережену версію індивідуального пошиття.';
    return errors;
  }
  if (selection.kind !== 'oneOffPpe') {
    if (!Number.isSafeInteger(selection.productId) || selection.productId <= 0)
      errors['productId'] = 'Оберіть товар.';
    if (
      selection.kind === 'sewing' &&
      (!Number.isSafeInteger(selection.articleId) || selection.articleId <= 0)
    )
      errors['articleId'] = 'Оберіть артикул пошиття.';
    if (selection.kind === 'ppe' && selection.override) {
      if (!positiveMoney(selection.override.amount))
        errors['amount'] = 'Вкажіть додатну ціну, не більше двох знаків після коми.';
      if (!validReason(selection.override.reason))
        errors['reason'] = 'Вкажіть причину зміни ціни, до 500 символів.';
    }
    return errors;
  }
  for (const tier of ['retail', 'wholesale', 'largeWholesale'] as const)
    if (!positiveMoney(selection.prices[tier]))
      errors[tier] = 'Вкажіть додатну ціну, не більше двох знаків після коми.';
  if (!validReason(selection.prices.reason))
    errors['reason'] = 'Вкажіть підставу ручних цін, до 500 символів.';
  return errors;
}
