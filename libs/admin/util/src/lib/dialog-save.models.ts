export type DialogFieldErrors = Record<string, string[]>;

export type DialogSaveResult =
  { success: true } | { success: false; fieldErrors: DialogFieldErrors };

export type DialogSaveHandler<TDraft> = (draft: TDraft) => Promise<DialogSaveResult>;
