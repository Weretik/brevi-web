export const nonWorkingDayNoteMaxLength = 200;

export interface NonWorkingDay {
  /** ISO date `yyyy-MM-dd`. */
  date: string;
  note: string | null;
}
