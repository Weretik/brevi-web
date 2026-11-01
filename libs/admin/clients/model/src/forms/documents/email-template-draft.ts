export interface EmailTemplateDraft {
  readonly name: string;
  readonly subject: string;
  readonly body: string;
}
export type EmailTemplateDraftErrors = Partial<Record<keyof EmailTemplateDraft, string>>;
export const emptyEmailTemplateDraft: EmailTemplateDraft = { name: '', subject: '', body: '' };
