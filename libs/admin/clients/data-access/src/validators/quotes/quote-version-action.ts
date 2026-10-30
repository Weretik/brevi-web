import { quoteText } from './quote-response-values';

import type { QuoteVersion } from '@admin/clients/model';

export function quoteVersionAction(value: unknown): QuoteVersion['action'] {
  const action = quoteText(value);
  if (
    action !== 'created' &&
    action !== 'edited' &&
    action !== 'recalculated' &&
    action !== 'copied'
  )
    throw new Error('Невідома схема версії КП.');
  return action;
}
