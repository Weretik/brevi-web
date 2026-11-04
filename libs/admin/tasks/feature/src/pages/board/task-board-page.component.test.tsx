import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import TaskBoardPage from './task-board-page';

import type { TaskSummary } from '@admin/tasks/model';

const card: TaskSummary = {
  id: 7,
  number: 'ЗД-0007',
  title: 'Відправити КП',
  status: 'New',
  lane: 'Active',
  isUrgent: false,
  isOverdue: false,
  dueAt: '2030-01-01T10:00:00Z',
  assignee: { userId: 5, name: 'Олена' },
  customerName: null,
  stepsTotal: 0,
  stepsDone: 0,
  completedAt: null,
  updatedAt: '2026-11-04T10:00:00Z',
  version: 1,
};

const boardQuery = vi.hoisted(() => vi.fn());
const assigneesQuery = vi.hoisted(() => vi.fn());
const idle = vi.hoisted(() => () => [vi.fn(), { isLoading: false }]);

vi.mock('@admin/tasks/data-access', () => ({
  useGetTaskBoardQuery: boardQuery,
  useGetTaskOverviewQuery: () => ({ data: undefined }),
  useGetTaskAssigneesQuery: assigneesQuery,
  useGetTaskQuery: () => ({ data: undefined, isFetching: false, isError: false }),
  useChangeTaskStatusMutation: idle,
  useSetTaskUrgentMutation: idle,
  useCreateTaskMutation: idle,
  useEditTaskMutation: idle,
  useMarkTaskStepMutation: idle,
  useDeleteTaskMutation: idle,
}));

vi.mock('@admin/clients/data-access', () => ({
  useListCustomersQuery: () => ({ data: undefined }),
}));

afterEach(() => {
  cleanup();
  boardQuery.mockReset();
  assigneesQuery.mockReset();
});

function renderBoard(isAdmin: boolean) {
  boardQuery.mockReturnValue({ data: [card], isFetching: false, isError: false });
  assigneesQuery.mockReturnValue({ data: [{ userId: 5, name: 'Олена', email: null }] });
  return render(<TaskBoardPage viewer={{ userId: isAdmin ? 1 : 5, isAdmin }} />);
}

describe('«Мої завдання»', () => {
  it('shows a Manager own cards without the manager filter or a create button', () => {
    renderBoard(false);
    expect(screen.getByRole('button', { name: 'ЗД-0007 Відправити КП' })).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Менеджер' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Нове завдання' })).not.toBeInTheDocument();
    expect(boardQuery).toHaveBeenCalledWith({ assigneeUserId: null });
  });

  it('lets Director and Admin switch the board to one manager', () => {
    renderBoard(true);
    fireEvent.click(screen.getByRole('button', { name: /Олена/ }));
    expect(boardQuery).toHaveBeenLastCalledWith({ assigneeUserId: 5 });
    expect(screen.getByRole('button', { name: 'Нове завдання' })).toBeInTheDocument();
  });
});
