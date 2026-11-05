import { describe, expect, it } from 'vitest';

import {
  fillUnmarked,
  formatHours,
  hoursInput,
  parseHours,
  shiftDay,
  timesheetDraftState,
} from './timesheet-form';

import type { TimesheetRow } from '../entities/workshop-timesheet';

const row = (employeeId: number, minutes: number | null, isActive = true): TimesheetRow => ({
  employeeId,
  name: `Працівник ${employeeId}`,
  position: 'Швачка',
  isActive,
  minutes,
  version: minutes === null ? null : 1,
});

describe('timesheet form', () => {
  it('parses hours in steps of 15 minutes', () => {
    expect(parseHours('8')).toBe(480);
    expect(parseHours('7,5')).toBe(450);
    expect(parseHours('0.25')).toBe(15);
    expect(parseHours('0')).toBe(0);
    expect(parseHours('7,3')).toBeNull();
    expect(parseHours('25')).toBeNull();
    expect(parseHours('')).toBeNull();
    expect(formatHours(450)).toBe('7,5');
    expect(hoursInput(450)).toBe('7,5');
  });

  it('saves only changed rows and marks wrong hours', () => {
    const rows = [row(1, 480), row(2, null), row(3, 0), row(4, 240)];
    const state = timesheetDraftState(rows, { 1: '8', 2: '7,5', 3: '', 4: '7,3' });

    expect(state.entries).toEqual([{ employeeId: 2, minutes: 450, version: null }]);
    expect(state.invalid).toEqual([3, 4]);
  });

  it('fills only workers not marked and not typed', () => {
    const rows = [row(1, 480), row(2, null), row(3, null), row(4, null, false)];
    expect(fillUnmarked(rows, { 3: '4' }, '8')).toEqual({ 2: '8', 3: '4' });
  });

  it('moves a day across months', () => {
    expect(shiftDay('2026-11-01', -1)).toBe('2026-10-31');
    expect(shiftDay('2026-12-31', 1)).toBe('2027-01-01');
  });
});
