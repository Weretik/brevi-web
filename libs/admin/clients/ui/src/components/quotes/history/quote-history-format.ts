import type { QuoteHistoryEvent } from '@admin/clients/model';

const actions: Record<QuoteHistoryEvent['action'], string> = {
  created: 'Створено',
  edited: 'Відредаговано',
  recalculated: 'Перераховано',
  copied: 'Скопійовано',
  transferred: 'Передано',
  archived: 'Архівовано',
  restored: 'Відновлено',
};
export const quoteHistoryAction = (action: QuoteHistoryEvent['action']) => actions[action];
export const quoteHistoryDate = (date: string) =>
  new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Europe/Kiev',
  }).format(new Date(date));
