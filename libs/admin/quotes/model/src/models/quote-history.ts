import type { QuoteEventKind } from '../entities/quote';

/** What a line of «Історія змін» says happened. */
export const quoteEventLabels: Readonly<Record<QuoteEventKind, string>> = {
  Created: 'Створено',
  Saved: 'Збережено зміни',
  Sent: 'Надіслано клієнту',
  Repriced: 'Перераховано ціни',
  ResponsibleChanged: 'Передано іншому менеджеру',
  Archived: 'Перенесено в архів',
  Restored: 'Повернуто з архіву',
  Copied: 'Створено копією',
};
