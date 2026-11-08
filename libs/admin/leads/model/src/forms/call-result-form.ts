import type { LeadCallResult, LeadOutcome } from '../entities/lead';

/** The «Результат дзвінка» drawer of «Довідники». Numbers stay text while typing. */
export interface LeadCallResultFormValues {
  readonly name: string;
  readonly outcome: LeadOutcome;
  readonly retryDays: string;
  readonly isActive: boolean;
  readonly position: string;
}

export const emptyLeadCallResultForm = (position: number): LeadCallResultFormValues => ({
  name: '',
  outcome: 'Callback',
  retryDays: '1',
  isActive: true,
  position: String(position),
});

export const leadCallResultFormFrom = (value: LeadCallResult): LeadCallResultFormValues => ({
  name: value.name,
  outcome: value.outcome,
  retryDays: String(value.retryDays ?? 1),
  isActive: value.isActive,
  position: String(value.position),
});
