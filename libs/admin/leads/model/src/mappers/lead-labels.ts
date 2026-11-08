import type { LeadOutcome, LeadStage } from '../entities/lead';

export type LeadTone = 'default' | 'info' | 'warning' | 'success' | 'error';

export const leadStageLabels: Readonly<Record<LeadStage, string>> = {
  New: 'Новий',
  InWork: 'У роботі',
  Talking: 'Розмова',
  Offer: 'Пропозиція',
  Client: 'Клієнт',
  Closed: 'Закрито',
};

export const leadStageTones: Readonly<Record<LeadStage, LeadTone>> = {
  New: 'default',
  InWork: 'info',
  Talking: 'warning',
  Offer: 'warning',
  Client: 'success',
  Closed: 'error',
};

export const leadOutcomeLabels: Readonly<Record<LeadOutcome, string>> = {
  Retry: 'Повторити пізніше',
  Callback: 'Передзвонити',
  Talking: 'Розмова з відповідальним',
  Offer: 'Пропозиція',
  Client: 'Став клієнтом',
  Closed: 'Закрити лід',
};

/** A short hint under a result button of «Мій день». */
export function leadOutcomeHint(outcome: LeadOutcome, retryDays: number | null): string {
  switch (outcome) {
    case 'Retry':
      return `повтор через ${retryDays ?? 1} дн`;
    case 'Callback':
    case 'Talking':
    case 'Offer':
      return 'оберіть дату';
    case 'Client':
      return 'завершить роботу';
    default:
      return 'закриє лід';
  }
}

export const leadOutcomes: readonly LeadOutcome[] = [
  'Retry',
  'Callback',
  'Talking',
  'Offer',
  'Client',
  'Closed',
];

export const isLeadOpen = (stage: LeadStage) => stage !== 'Client' && stage !== 'Closed';
