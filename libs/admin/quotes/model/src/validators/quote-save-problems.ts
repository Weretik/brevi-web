import { quoteIntroSeasonLabels } from '../models/quote-intro-draft';

import type { QuoteDraft } from '../models/quote-draft';
import type { QuoteIntroDraft } from '../models/quote-intro-draft';

/** One reason a КП cannot be saved; `target` is where the page scrolls to fix it. */
export interface QuoteSaveProblem {
  readonly text: string;
  readonly target: string | null;
}

const number = (index: number) => String(index + 1).padStart(2, '0');

/**
 * The editor problems as a list for «Чому КП не зберігається»: the client first, then each item and its prices,
 * named by position so the manager knows where to look. `target` is `header` or the item key.
 */
export function quoteSaveProblems(
  draft: QuoteDraft,
  errors: Readonly<Record<string, string>>,
): QuoteSaveProblem[] {
  const problems: QuoteSaveProblem[] = [];
  if (errors['header']) problems.push({ text: `Клієнт: ${errors['header']}`, target: 'header' });
  draft.items.forEach((item, index) => {
    const name = item.name.trim() ? ` «${item.name.trim()}»` : '';
    const where = `Позиція ${number(index)}${name}`;
    const itemError = errors[`item:${item.key}`];
    if (itemError) problems.push({ text: `${where}: ${itemError}`, target: item.key });
    for (const option of item.options) {
      const optionError = errors[`option:${option.key}`];
      if (optionError) {
        const title = option.title.trim() ? `, «${option.title.trim()}»` : '';
        problems.push({ text: `${where}${title}: ${optionError}`, target: item.key });
      }
    }
  });
  return problems;
}

const introFields: Readonly<Record<string, string>> = {
  internalName: 'Клієнт або назва запиту',
  recipientEmail: 'Email отримувача',
  recipientName: 'Отримувач',
  companyName: 'Підприємство',
  managerNote: 'Нотатка менеджера',
  pages: 'Моделі',
};

/** The same list for «КП для знайомства»: the fields of the recipient step, then each page place by season. */
export function quoteIntroSaveProblems(
  draft: QuoteIntroDraft,
  errors: Readonly<Record<string, string>>,
): QuoteSaveProblem[] {
  const problems: QuoteSaveProblem[] = [];
  for (const [key, label] of Object.entries(introFields))
    if (errors[key]) problems.push({ text: `${label}: ${errors[key]}`, target: key });
  for (const page of draft.pages)
    page.slots.forEach((slot, index) => {
      const error = errors[`slot:${slot.key}`];
      if (error)
        problems.push({
          text: `${quoteIntroSeasonLabels[page.season]}, модель ${index + 1}: ${error}`,
          target: `slot:${slot.key}`,
        });
    });
  return problems;
}
