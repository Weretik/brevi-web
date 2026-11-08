/** The result form of «Мій день». `nextContactAt` is a `datetime-local` value or empty. */
export interface LeadCallFormValues {
  readonly resultId: number | null;
  readonly nextContactAt: string;
  readonly comment: string;
}

export const emptyLeadCallForm: LeadCallFormValues = {
  resultId: null,
  nextContactAt: '',
  comment: '',
};
