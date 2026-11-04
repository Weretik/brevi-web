import { draftPriceAmount, quoteDraftErrors } from './quote-draft-validation';
import { quoteTiers } from '../models/quote-draft';

import type { QuoteTier } from '../entities/quote';
import type { QuoteDraft } from '../models/quote-draft';

/** A problem that stops the КП from being sent, with the item it belongs to. */
export interface QuoteDraftProblem {
  /** `header`, `items`, or the key of the item. */
  readonly target: string;
  readonly text: string;
}

/** Whether a tier is shown in every price row, in none, or only in some. */
export type QuoteTierVisibility = 'all' | 'some' | 'none';

export function quoteTierVisibility(draft: QuoteDraft, tier: QuoteTier): QuoteTierVisibility {
  const flags = draft.items.flatMap((item) => item.options.map((o) => o.prices[tier].shown));
  if (flags.length === 0 || flags.every(Boolean)) return 'all';
  return flags.some(Boolean) ? 'some' : 'none';
}

/** Counts for «Підсумок»: items, price rows and the prices the client will see. */
export function quoteDraftSummary(draft: QuoteDraft) {
  const options = draft.items.flatMap((item) => item.options);
  const shownPrices = options.reduce(
    (count, option) =>
      count +
      quoteTiers.filter(
        (tier) => option.prices[tier].shown && (draftPriceAmount(option.prices[tier]) ?? 0) > 0,
      ).length,
    0,
  );
  return { items: draft.items.length, options: options.length, shownPrices };
}

const itemLabel = (index: number, name: string) =>
  `${String(index + 1).padStart(2, '0')} ${name.trim() || 'Без назви'}`;

/** Live problems for «Перед надсиланням»; empty when the КП can be sent. */
export function quoteDraftProblems(draft: QuoteDraft): QuoteDraftProblem[] {
  const errors = quoteDraftErrors(draft);
  const problems: QuoteDraftProblem[] = [];
  if (errors['header']) problems.push({ target: 'header', text: errors['header'] });
  if (draft.items.length === 0)
    problems.push({ target: 'items', text: 'Додайте хоча б одну позицію.' });
  draft.items.forEach((item, index) => {
    const own = [
      errors[`item:${item.key}`],
      ...item.options.map((option) => errors[`option:${option.key}`]),
    ].filter((x): x is string => Boolean(x));
    for (const text of new Set(own))
      problems.push({ target: item.key, text: `${itemLabel(index, item.name)}: ${text}` });
  });
  return problems;
}
