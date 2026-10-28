import { quoteBasisState } from './quote-basis-state';
import { quotePriceErrors } from './quote-price-validation';

import type { QuoteDraft } from '../../models/quotes/quote-draft';

export function quoteDraftErrors(draft: QuoteDraft, now: number): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!draft.customerId && (!draft.recipientName.trim() || draft.recipientName.length > 300))
    errors['recipientName'] = 'Вкажіть одержувача, до 300 символів.';
  if (draft.contactId && !draft.customerId) errors['contactId'] = 'Спочатку оберіть клієнта.';
  if (draft.items.length > 100) errors['items'] = 'У чернетці може бути до 100 позицій.';
  draft.items.forEach((item, index) => {
    const path = `items.${index}`;
    if (!item.title.trim() || item.title.length > 300)
      errors[`${path}.title`] = 'Вкажіть назву позиції, до 300 символів.';
    for (const field of ['publicDescription', 'publicComment', 'internalNote'] as const)
      if (item[field].length > 5000) errors[`${path}.${field}`] = 'Максимум 5000 символів.';
    if (item.variants.length > 30)
      errors[`${path}.variants`] = 'У позиції може бути до 30 варіантів.';
    item.variants.forEach((variant, variantIndex) => {
      const variantPath = `${path}.variants.${variantIndex}`;
      if (!variant.title.trim() || variant.title.length > 300)
        errors[`${variantPath}.title`] = 'Вкажіть назву варіанта, до 300 символів.';
      for (const [field, message] of Object.entries(quotePriceErrors(variant.selection)))
        errors[`${variantPath}.${field}`] = message;
      const state = quoteBasisState(variant, now);
      if (state === 'missing' || state === 'changed')
        errors[`${variantPath}.basis`] = 'Отримайте серверний розрахунок для цього вибору.';
      if (state === 'expired')
        errors[`${variantPath}.basis`] = 'Строк розрахунку минув. Явно оновіть розрахунок.';
    });
  });
  return errors;
}
