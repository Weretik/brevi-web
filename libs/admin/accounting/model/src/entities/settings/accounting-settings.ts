/** Fixed rules of the books: the cutover date and today in Kyiv (YYYY-MM-DD). */
export interface AccountingSettings {
  cutoverDate: string;
  timeZone: string;
  today: string;
}

/** Shown until the settings arrive; the backend owns the real value. */
export const defaultCutoverDate = '2026-10-01';
