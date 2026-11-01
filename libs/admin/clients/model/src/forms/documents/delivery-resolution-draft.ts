export interface DeliveryResolutionDraft {
  readonly outcome: '' | 'sent' | 'not_sent';
  readonly evidenceNote: string;
}
export type DeliveryResolutionErrors = Partial<Record<keyof DeliveryResolutionDraft, string>>;
export const emptyDeliveryResolutionDraft: DeliveryResolutionDraft = {
  outcome: '',
  evidenceNote: '',
};
