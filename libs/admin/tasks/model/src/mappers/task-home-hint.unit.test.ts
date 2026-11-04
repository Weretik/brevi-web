import { describe, expect, it } from 'vitest';

import { taskHomeHint } from './task-home-hint';

import type { TaskOverview } from '../entities/manager-task';

const overview = (overdue: number, urgent: number): TaskOverview => ({
  open: 5,
  overdue,
  urgent,
  new: 1,
  inProgress: 4,
  done: 0,
  doneLastWeek: 0,
  onTimePercent: null,
  load: [],
});

describe('taskHomeHint', () => {
  it('names only what burns', () => {
    expect(taskHomeHint(overview(2, 1))).toBe('Завдання: прострочено 2 · терміново 1');
    expect(taskHomeHint(overview(0, 3))).toBe('Завдання: терміново 3');
  });

  it('stays silent when nothing burns or nothing is loaded', () => {
    expect(taskHomeHint(overview(0, 0))).toBeNull();
    expect(taskHomeHint(undefined)).toBeNull();
  });
});
