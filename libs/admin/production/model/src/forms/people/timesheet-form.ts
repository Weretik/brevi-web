import { TIMESHEET_MAX_MINUTES, TIMESHEET_STEP_MINUTES } from '../../entities/people/workshop-timesheet';

import type { TimesheetEntryBody, TimesheetRow } from '../../entities/people/workshop-timesheet';

/** Hours typed by the head of the workshop, by worker id; a key is present only once typed. */
export type TimesheetDraft = Record<number, string>;

const hours = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

/** «7,5» hours of 450 minutes. */
export const formatHours = (minutes: number) => hours.format(minutes / 60);

/** What the input shows for saved minutes: «7,5». */
export const hoursInput = (minutes: number) => String(minutes / 60).replace('.', ',');

/** Minutes of «7,5» or «7.25» hours; null unless 0–24 hours in steps of 15 minutes. */
export function parseHours(raw: string): number | null {
  const text = raw.trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(text)) return null;
  const minutes = Number(text) * 60;
  return Number.isInteger(minutes) &&
    minutes <= TIMESHEET_MAX_MINUTES &&
    minutes % TIMESHEET_STEP_MINUTES === 0
    ? minutes
    : null;
}

export interface TimesheetDraftState {
  /** Rows to save: typed hours that differ from the saved ones. */
  entries: TimesheetEntryBody[];
  /** Workers whose typed hours are not 0–24 in steps of 0.25. */
  invalid: number[];
}

export function timesheetDraftState(
  rows: readonly TimesheetRow[],
  draft: TimesheetDraft,
): TimesheetDraftState {
  const entries: TimesheetEntryBody[] = [];
  const invalid: number[] = [];
  for (const row of rows) {
    const raw = draft[row.employeeId];
    if (raw === undefined) continue;
    const minutes = parseHours(raw);
    if (minutes === null) {
      if (raw.trim() !== '' || row.minutes !== null) invalid.push(row.employeeId);
      continue;
    }
    if (minutes !== row.minutes)
      entries.push({ employeeId: row.employeeId, minutes, version: row.version });
  }
  return { entries, invalid };
}

/** «8 год усім»: fills the workers not marked and not typed yet; typed exceptions stay. */
export function fillUnmarked(
  rows: readonly TimesheetRow[],
  draft: TimesheetDraft,
  value: string,
): TimesheetDraft {
  const next = { ...draft };
  for (const row of rows)
    if (row.isActive && row.minutes === null && next[row.employeeId] === undefined)
      next[row.employeeId] = value;
  return next;
}

/** The day before or after «2026-11-04». */
export function shiftDay(day: string, by: number) {
  const [year, month, date] = day.split('-').map(Number);
  return new Date(Date.UTC(year ?? 2000, (month ?? 1) - 1, (date ?? 1) + by))
    .toISOString()
    .slice(0, 10);
}
