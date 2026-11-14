import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import TaskBoardPage from './task-board-page';

import type { TaskDetail, TaskSummary } from '@admin/tasks/model';

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
  createdAt: '2026-11-04T09:00:00Z',
  version: 1,
};

const detail: TaskDetail = {
  ...card,
  description: null,
  leadId: null,
  author: { userId: 1, name: 'Директор' },
  customerPublicId: null,
  steps: [],
  history: [],
};

const boardQuery = vi.hoisted(() => vi.fn());
const taskQuery = vi.hoisted(() => vi.fn());
const changeStatus = vi.hoisted(() => vi.fn());
const assigneesQuery = vi.hoisted(() => vi.fn());
const idle = vi.hoisted(() => () => [vi.fn(), { isLoading: false }]);

vi.mock('@admin/tasks/data-access', () => ({
  useGetTaskBoardQuery: boardQuery,
  useGetTaskOverviewQuery: () => ({ data: undefined }),
  useGetTaskAssigneesQuery: assigneesQuery,
  useGetTaskQuery: taskQuery,
  useChangeTaskStatusMutation: () => [changeStatus, { isLoading: false }],
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
  taskQuery.mockReset();
  changeStatus.mockReset();
});

function renderBoard(isAdmin: boolean) {
  boardQuery.mockReturnValue({ data: [card], isFetching: false, isError: false });
  assigneesQuery.mockReturnValue({ data: [{ userId: 5, name: 'Олена', email: null }] });
  taskQuery.mockReturnValue({ data: undefined, isFetching: false, isError: false });
  return render(<TaskBoardPage viewer={{ userId: isAdmin ? 1 : 5, isAdmin }} />);
}

describe('«Мої завдання»', () => {
  it('shows a Manager own cards without the manager filter or a create button', () => {
    renderBoard(false);
    expect(screen.getByRole('button', { name: 'ЗД-0007 Відправити КП' })).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Менеджер' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Нове завдання' })).not.toBeInTheDocument();
    expect(boardQuery).toHaveBeenCalledWith({ assigneeUserId: null, period: 'Week' });
  });

  it('lets Director and Admin switch the board to one manager', () => {
    renderBoard(true);
    fireEvent.click(screen.getByRole('button', { name: /Олена/ }));
    expect(boardQuery).toHaveBeenLastCalledWith({ assigneeUserId: 5, period: 'Week' });
    expect(screen.getByRole('button', { name: 'Нове завдання' })).toBeInTheDocument();
  });

  it('narrows the done tasks by «Період», «Цей тиждень» first', () => {
    renderBoard(false);
    const period = screen.getByRole('group', { name: 'Період' });
    expect(
      within(period)
        .getAllByRole('button')
        .map((x) => x.textContent),
    ).toEqual(['Цей тиждень', 'Минулий тиждень', 'Останній місяць', 'Квартал', 'Рік', 'Усі']);
    fireEvent.click(within(period).getByRole('button', { name: 'Квартал' }));
    expect(boardQuery).toHaveBeenLastCalledWith({ assigneeUserId: null, period: 'Quarter' });
  });

  it('«Виконано» in the panel marks the task done and closes the panel', async () => {
    renderBoard(false);
    taskQuery.mockReturnValue({ data: detail, isFetching: false, isError: false });
    changeStatus.mockReturnValue({ unwrap: () => Promise.resolve({ ...detail, status: 'Done' }) });
    fireEvent.click(screen.getByRole('button', { name: 'ЗД-0007 Відправити КП' }));
    const panel = await screen.findByRole('dialog', { name: 'ЗД-0007' });
    expect(within(panel).queryByRole('button', { name: 'Позначити виконаним' })).toBeNull();
    fireEvent.click(within(panel).getByRole('button', { name: 'Виконано' }));

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'ЗД-0007' })).toBeNull());
    expect(changeStatus).toHaveBeenCalledWith({ id: 7, version: 1, status: 'Done' });
    expect(screen.getByText('Завдання ЗД-0007 виконано')).toBeInTheDocument();
  });
});
