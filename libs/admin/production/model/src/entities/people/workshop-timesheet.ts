export const TIMESHEET_STEP_MINUTES = 15;
export const TIMESHEET_MAX_MINUTES = 1440;

/** A worker on a day of «Робочий час»; `minutes` is null while the day is not marked for them. */
export interface TimesheetRow {
  employeeId: number;
  name: string;
  position: string;
  isActive: boolean;
  minutes: number | null;
  version: number | null;
}

/** One change of the hours; `beforeMinutes` is null on the first mark. */
export interface TimesheetChange {
  id: number;
  employeeId: number;
  employeeName: string;
  beforeMinutes: number | null;
  afterMinutes: number;
  changedAt: string;
  changedByName: string;
}

export interface TimesheetMonthDay {
  date: string;
  people: number;
  minutes: number;
}

export interface TimesheetMonthEmployee {
  employeeId: number;
  name: string;
  position: string;
  days: number;
  minutes: number;
}

/** «Архів табеля»: the month of the day by day and by worker. */
export interface TimesheetMonth {
  month: string;
  days: TimesheetMonthDay[];
  employees: TimesheetMonthEmployee[];
}

export interface TimesheetDay {
  date: string;
  /** The day has come and its payroll month is not closed. */
  canEdit: boolean;
  isMonthClosed: boolean;
  rows: TimesheetRow[];
  changes: TimesheetChange[];
  month: TimesheetMonth;
}

export interface TimesheetEntryBody {
  employeeId: number;
  minutes: number;
  version: number | null;
}

export interface SaveTimesheetDayBody {
  date: string;
  entries: TimesheetEntryBody[];
}
