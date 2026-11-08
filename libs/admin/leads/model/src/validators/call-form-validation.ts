import type { LeadCallResult } from '../entities/lead';
import type { LeadCallFormValues } from '../forms/call-form';
import type { LeadCallResultFormValues } from '../forms/call-result-form';

export interface LeadCallFormErrors {
  readonly resultId?: string;
  readonly nextContactAt?: string;
  readonly comment?: string;
}

export const leadCommentMaxLength = 2000;

/** The server checks the same (LEAD-001 R-06, R-07); this only explains it before sending. */
export function validateLeadCallForm(
  values: LeadCallFormValues,
  results: readonly LeadCallResult[],
  now: Date,
): LeadCallFormErrors {
  const result = results.find((x) => x.id === values.resultId);
  const errors: { -readonly [K in keyof LeadCallFormErrors]: string } = {};
  if (!result) errors.resultId = 'Оберіть результат дзвінка.';
  const needsDate =
    result &&
    (result.outcome === 'Callback' || result.outcome === 'Talking' || result.outcome === 'Offer');
  const closes = result && (result.outcome === 'Client' || result.outcome === 'Closed');
  if (needsDate && !values.nextContactAt)
    errors.nextContactAt = 'Вкажіть, коли зв’язатися наступного разу.';
  if (!closes && values.nextContactAt) {
    const date = new Date(values.nextContactAt);
    if (Number.isNaN(date.getTime())) errors.nextContactAt = 'Невірна дата.';
    else if (date.getTime() < now.getTime() - 5 * 60 * 1000)
      errors.nextContactAt = 'Ця дата вже минула.';
  }
  if (values.comment.length > leadCommentMaxLength)
    errors.comment = `Коментар до ${leadCommentMaxLength} символів.`;
  return errors;
}

/** The date field is shown for every result except those that end the work. */
export const leadResultTakesDate = (result: LeadCallResult | undefined) =>
  result !== undefined && result.outcome !== 'Client' && result.outcome !== 'Closed';

export interface LeadCallResultFormErrors {
  readonly name?: string;
  readonly retryDays?: string;
  readonly position?: string;
}

export const leadCallResultNameMaxLength = 60;

/** Mirrors the server checks of a call result (LEAD-001 R-10). */
export function validateLeadCallResultForm(
  values: LeadCallResultFormValues,
  others: readonly LeadCallResult[],
): LeadCallResultFormErrors {
  const errors: { -readonly [K in keyof LeadCallResultFormErrors]: string } = {};
  const name = values.name.trim();
  if (!name) errors.name = 'Вкажіть назву.';
  else if (name.length > leadCallResultNameMaxLength)
    errors.name = `Назва до ${leadCallResultNameMaxLength} символів.`;
  else if (others.some((x) => x.name.trim().toLowerCase() === name.toLowerCase()))
    errors.name = 'Такий результат уже є.';
  if (values.outcome === 'Retry') {
    const days = Number(values.retryDays);
    if (!Number.isInteger(days) || days < 1 || days > 60) errors.retryDays = 'Від 1 до 60 днів.';
  }
  const position = Number(values.position);
  if (!Number.isInteger(position) || position < 0 || position > 1000)
    errors.position = 'Ціле число від 0 до 1000.';
  return errors;
}

export const leadCategoryDescriptionMaxLength = 200;
