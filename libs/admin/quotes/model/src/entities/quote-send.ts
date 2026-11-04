/** A ready letter: the template from «Налаштування КП» or one of the letter variants, marks already filled. */
export interface QuoteLetter {
  readonly name: string;
  readonly subject: string;
  readonly body: string;
}

/** What «Надіслати КП» starts from. */
export interface QuoteSendDraft {
  /** The signed-in person's connected Gmail; null until connected. */
  readonly fromEmail: string | null;
  readonly fromName: string;
  /** False while the server has no Google keys. */
  readonly gmailConfigured: boolean;
  readonly fileName: string;
  readonly letters: readonly QuoteLetter[];
}

/** The letter the manager edits before sending. */
export interface QuoteSendForm {
  to: string;
  subject: string;
  body: string;
}
