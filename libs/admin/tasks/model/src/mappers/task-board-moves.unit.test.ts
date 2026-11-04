import { describe, expect, it } from 'vitest';

import { groupTasksByLane, taskMove, tasksForToday } from './task-board-moves';

import type { TaskSummary, TaskViewer } from '../entities/manager-task';

const manager: TaskViewer = { userId: 17, isAdmin: false };
const director: TaskViewer = { userId: 1, isAdmin: true };

const card = (patch: Partial<TaskSummary> = {}): TaskSummary => ({
  id: 1,
  number: 'ЗД-0001',
  title: 'Передзвонити',
  status: 'New',
  lane: 'Active',
  isUrgent: false,
  isOverdue: false,
  dueAt: '2026-11-05T10:00:00Z',
  assignee: { userId: 17, name: 'Ольга' },
  customerName: null,
  stepsTotal: 0,
  stepsDone: 0,
  completedAt: null,
  updatedAt: '2026-11-04T10:00:00Z',
  version: 1,
  ...patch,
});

describe('taskMove', () => {
  it('never targets «Прострочено» or the same lane', () => {
    expect(taskMove(card(), 'Overdue', director)).toBeNull();
    expect(taskMove(card(), 'Active', director)).toBeNull();
  });

  it('lets anyone finish, reopen and take a task into work', () => {
    expect(taskMove(card(), 'Done', manager)).toEqual({ kind: 'status', status: 'Done' });
    expect(taskMove(card({ status: 'Done', lane: 'Done' }), 'Active', manager)).toEqual({
      kind: 'status',
      status: 'InProgress',
    });
    expect(taskMove(card({ isUrgent: true, lane: 'Urgent' }), 'Active', manager)).toEqual({
      kind: 'status',
      status: 'InProgress',
    });
  });

  it('lets only Director and Admin move a card into or out of «Терміново»', () => {
    expect(taskMove(card(), 'Urgent', manager)).toBeNull();
    expect(taskMove(card(), 'Urgent', director)).toEqual({ kind: 'urgent', isUrgent: true });
    const urgentInWork = card({ status: 'InProgress', isUrgent: true, lane: 'Urgent' });
    expect(taskMove(urgentInWork, 'Active', manager)).toBeNull();
    expect(taskMove(urgentInWork, 'Active', director)).toEqual({ kind: 'urgent', isUrgent: false });
  });
});

describe('board helpers', () => {
  it('groups by lane in server order', () => {
    const lanes = groupTasksByLane([
      card({ id: 1, lane: 'Done' }),
      card({ id: 2 }),
      card({ id: 3 }),
    ]);
    expect(lanes.Active.map((x) => x.id)).toEqual([2, 3]);
    expect(lanes.Done.map((x) => x.id)).toEqual([1]);
  });

  it('picks up to three tasks for today, overdue first', () => {
    const now = new Date(2026, 10, 4, 9, 0);
    const today = tasksForToday(
      [
        card({ id: 1, dueAt: new Date(2026, 10, 4, 17, 0).toISOString() }),
        card({ id: 2, dueAt: new Date(2026, 10, 9).toISOString() }),
        card({
          id: 3,
          isOverdue: true,
          lane: 'Overdue',
          dueAt: new Date(2026, 10, 1).toISOString(),
        }),
        card({ id: 4, status: 'Done', lane: 'Done', dueAt: new Date(2026, 10, 4).toISOString() }),
      ],
      now,
    );
    expect(today.map((x) => x.id)).toEqual([3, 1]);
  });
});
